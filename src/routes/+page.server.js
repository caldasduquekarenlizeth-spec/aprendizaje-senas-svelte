import { supabase } from "$lib/supabaseClient";

async function registrarUsuario(correo, password, nombre) {
  // Paso 1: Crear la cuenta de autenticación
    const { data: authData, error: authError } = await supabase.auth.signUp({
    email: correo,
    password: password
    });

    if (authError) {
    console.error('Error al registrar usuario:', authError.message);
    return;
    }

  // Paso 2: Si el usuario se creó correctamente, actualizar el username en public.profiles
    if (authData.user) {
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ nombre: nombre })
        .eq('id', authData.user.id);

    if (profileError) {
        console.error('Error al guardar el nombre de usuario:', profileError.message);
    } else {
        console.log('¡Usuario y perfil creados con éxito!');
    }
    }
}
