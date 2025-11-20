import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
      },
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    console.log('Fetching ingredients for user:', user.id);

    // Get user's ingredients, prioritizing those expiring soon
    const { data: ingredients, error: ingredientsError } = await supabase
      .from('ingredients')
      .select('*')
      .eq('user_id', user.id)
      .order('expiry_date', { ascending: true })
      .limit(10);

    if (ingredientsError) {
      console.error('Error fetching ingredients:', ingredientsError);
      throw ingredientsError;
    }

    if (!ingredients || ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No ingredients found. Please add some ingredients first.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Found ingredients:', ingredients.length);

    const ingredientNames = ingredients.map(i => i.name).join(', ');
    const expiringIngredients = ingredients.slice(0, 5).map(i => i.name).join(', ');

    const systemPrompt = `You are a creative chef AI that generates delicious recipes. 
Generate 3 unique recipes that use the available ingredients, prioritizing those that are expiring soon.
Each recipe should be practical, delicious, and make good use of the ingredients.`;

    const userPrompt = `Available ingredients: ${ingredientNames}

Ingredients expiring soon: ${expiringIngredients}

Please generate 3 diverse recipes. For each recipe, provide:
1. A catchy title
2. A brief description (1-2 sentences)
3. List of ingredients needed (from the available ingredients)
4. Preparation time (e.g., "30 min")
5. Difficulty level (Easy, Medium, or Hard)

Format your response as valid JSON array with this structure:
[
  {
    "title": "Recipe Name",
    "description": "Brief description",
    "ingredients": ["ingredient1", "ingredient2"],
    "prep_time": "30 min",
    "difficulty": "Easy"
  }
]`;

    console.log('Calling Lovable AI...');

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (aiResponse.status === 402) {
        throw new Error('AI credits exhausted. Please add credits to continue.');
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('No content in AI response');
    }

    console.log('AI Response received');

    // Extract JSON from the response
    let recipes;
    try {
      // Try to find JSON array in the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recipes = JSON.parse(jsonMatch[0]);
      } else {
        recipes = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('AI content:', content);
      throw new Error('Failed to parse AI response');
    }

    console.log('Parsed recipes:', recipes.length);

    // Save recipes to database
    const recipesToInsert = recipes.map((recipe: any) => ({
      user_id: user.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      prep_time: recipe.prep_time,
      difficulty: recipe.difficulty,
      image: null,
    }));

    const { data: savedRecipes, error: saveError } = await supabase
      .from('recipes')
      .insert(recipesToInsert)
      .select();

    if (saveError) {
      console.error('Error saving recipes:', saveError);
      throw saveError;
    }

    console.log('Recipes saved successfully:', savedRecipes?.length);

    return new Response(
      JSON.stringify({ recipes: savedRecipes }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-recipes function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});