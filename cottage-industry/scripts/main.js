fetch('https://raw.githubusercontent.com/FreshAlacrity/cottage-industry/main/minecraftinstance.json')
  .then(response => response.json())
  .then(data => {
    
    console.log(data)
    let listElement = document.getElementById("featured-list")
    let htmlString = ''

    for (const [type, url] of Object.entries(data)) {
      htmlString += type
    }

    listElement.innerHTML = `Featured List Here<br>${htmlString}<br><br><pre>${JSON.stringify(data, null, 2)}</pre>`
  
  });
