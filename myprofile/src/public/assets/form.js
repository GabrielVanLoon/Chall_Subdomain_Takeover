window.onload = function(){
    const form = document.getElementById('visitform')
    form.addEventListener('submit', function(e) { 
        e.preventDefault()
        
        const targetUrl = document.getElementById('target').value 

        fetch('/visit', {
            method: 'POST',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify({target: targetUrl})
        })
        .then((res) => res.json())
        .then((res) => { alert(res.message) })
    })
}