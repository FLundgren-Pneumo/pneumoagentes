// Placeholder para checagem real de licenca via Supabase service role.
exports.handler = async function(event){
  const params = event.queryStringParameters || {};
  return {statusCode:200,headers:{'content-type':'application/json'},body:JSON.stringify({allowed:false,message:'Conectar ao Supabase para validar medico/agente.',params})};
};
