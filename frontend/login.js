document.getElementById('login-form').addEventListener('submit', (e) =>{
    e.preventDefault()
    const form = e.target
    const email = form.elements['login-email'].value
    const password = form.elements['login-password'].value

    checkSignIn(email,password)
}
)


async function checkSignIn(email, password){

    try{
        const response = await fetch(' http://127.0.0.1:5001/sign_in', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email:email, password:password}),
            credentials: 'include'
            
        })

        if ( !response){
            throw new Error('Network response was not ok');
        }

        const data = await response.json()
        if (data.message == 'password match'){
            window.location.href = './index.html'
        }
        else if(data.message == 'wrong password'){
            alert('wrong password, try again')
        }
        else{
            window.location.href = './register.html'
        }
    }catch (error) {
        console.error('Error:', error);
    }
}
