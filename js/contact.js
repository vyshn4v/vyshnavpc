const  backendUrl = 'http://localhost:3000/portfolio/contact';


document.getElementById('contact-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fname = document.getElementById('fname');
    const lname = document.getElementById('lname');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    if(!fname.value){
        fname.style.borderColor = fname.value ? '': 'red';
        return;
    }else{
        fname.style.borderColor = '';
    }
    if(!lname.value){
        lname.style.borderColor = lname.value ? '': 'red';
        return;
    }else{
        lname.style.borderColor = '';
    }
    if(!email.value){
        email.style.borderColor = email.value ? '': 'red';
        return;
    }else{
        email.style.borderColor = '';
    }
    if(!subject.value){
        subject.style.borderColor = subject.value ? '': 'red';
        return;
    }else{ 
        subject.style.borderColor = '';
    }   
    if(!message.value){
        message.style.borderColor = message.value ? '': 'red';
        return;
    }else{
        message.style.borderColor = '';
    }
    const user ={
        fname: fname.value,
        lname: lname.value,
        email: email.value, 
        subject: subject.value,
        message: message.value
    }
    console.log(user);
    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        if (response.ok) {
            alert('Message sent successfully!');
            document.getElementById('contact-form').reset();
        } else {
            alert('Error sending message.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error sending message.');
    }
});