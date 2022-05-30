async function register()
{
	try
	{
		let name = document.getElementById("name").value;
		let pass = document.getElementById("password").value;
		let res = await requestRegister(name, pass);
		alert(res.msg);
	}
	catch (err)
	{
		console.log(err);
	}
}