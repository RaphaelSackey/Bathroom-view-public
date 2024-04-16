document.getElementById('registrationForm').addEventListener('submit', (e)=>{

    e.preventDefault()
    const form = e.target
    const username = form.elements['username'].value
    const email = form.elements['email'].value
    const password = form.elements['password'].value
    const ver_password= form.elements['ver_password'].value

    if (password !== ver_password){
        return alert('passwords do not match ')
    }

    register(username,email, password)
})


async function register(username, email, password){

    try{
        const response = await fetch ('http://127.0.0.1:5001/register',{

            method : 'post',
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify({
                email : email,
                password : password,
                username: username
            }),
            


        })

        if (!response){
            throw new Error('Network response was not ok');
        }

        const data = await response.json()
        console.log(data)
        if (data.message == 'success'){
            window.location.href = './index.html'
        }
        else if (data.message == 'account already exists'){
            alert('an account already exists with that email, sign in')
        }

        else{
            alert('something went wrong')
        }

    }catch (error) {
        console.error('Error:', error);
    }
    

}