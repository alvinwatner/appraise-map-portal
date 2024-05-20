const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = "https://jyoprwxzpxbvgtfgrmrl.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5b3Byd3h6cHhidmd0ZmdybXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYyMDUyNDgsImV4cCI6MjAzMTc4MTI0OH0.2Nbjx0ngKR1Pmt4cg-vli5VK8oF-chDjNwNH1x2yNtI";
const supabase = createClient(supabaseUrl, supabaseKey);

const createSuperAdminUser = async () => {
  try {
    // Step 1: Create the super admin role if it doesn't exist
    let { data: role, error: roleError } = await supabase
      .from('role')
      .upsert([{ name: 'Super Admin' }], { onConflict: ['name'] })
      .select();

    if (roleError) {
      throw roleError;
    }

    const roleId = role[0].id;

    // Step 2: Create the user with Supabase Auth
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email: 'superadmingpk@yopmail.com',
      password: 'gpk123#'
    });

    if (authError) {
      throw authError;
    }

    const userId = authUser.user.id;

    // Step 3: Insert the user into the users table with the super admin role
    let { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        "RoleId": roleId,
        email: 'superadmingpk@yopmail.com',
        username: 'superadmingpk',
        password: null, // Supabase Auth handles the password
        "lastLogin": new Date(),
        "isActive": true
      }]);

    if (userError) {
      throw userError;
    }

    console.log('Super admin user created successfully:', user);
  } catch (error) {
    console.error('Error creating super admin user:', error);
  }
};

createSuperAdminUser();