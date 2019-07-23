(function () {

  const baseUrl = 'https://lighthouse-user-api.herokuapp.com'
  const indexUrl = baseUrl + '/api/v1/users/'
  const data = JSON.parse(localStorage.getItem('list')) || []
  //data來源為localSotrage
  const dataPanel = document.getElementById('data-panel')


  diaplayUserList(data)

  function diaplayUserList(data) {
    let htmlContemt = ''
    data.forEach(element => {
      //需要判別部分分開寫
      if (element.gender === "female") {
        htmlContemt += `
        <div class="card bg-warning m-3" style="width: 12rem;">
          <a href="" data-toggle="modal" data-target="#exampleModal">
            <img src="${element.avatar}" alt="avatar" class="card-img-top img" data-id="${element.id}">
          </a>
          <p class="card-text m-2"><i class="fas fa-female"> ${element.surname} ${element.name}</i></p>
      `
      } else if (element.gender === "male") {
        htmlContemt += `
        <div class="card bg-info m-3" style="width: 12rem;">
          <a href="" data-toggle="modal" data-target="#exampleModal">
            <img src="${element.avatar}" alt="avatar" class="card-img-top img" data-id="${element.id}">
          </a>
          <p class="card-text m-2"><i class="fas fa-male"> ${element.surname} ${element.name}</i></p>
      `
      }

      htmlContemt += `
          <div class="btngroup">
              <button class="more btn btn-light" data-id="${element.id}" data-toggle="modal" data-target="#exampleModal">More</button>
              <button class="delete btn btn-danger" data-id="${element.id}" >delete</button>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContemt
  }

  //監控datapanel
  dataPanel.addEventListener('click', event => {
    if ((event.target.matches('.img')) || ((event.target.matches('.more')))) {
      console.log(event.target.dataset.id)
      userDetails(event.target.dataset.id)

    } else if (event.target.matches('.delete')) {

      deleteLike(event.target.dataset.id)
    }

  })

  //delete按鈕
  function deleteLike(id) {
    const deleteItem = data.findIndex(item => item.id === Number(id))
    //若無找到 findIndex會返回-1，若找到則返回位置(從0開始)
    if (deleteItem === -1) return
    console.log(deleteItem)
    data.splice(deleteItem, 1)
    localStorage.setItem('list', JSON.stringify(data))
    diaplayUserList(data)//為何會延遲！
  }

  //設定modal彈出內容
  function userDetails(id) {

    const userTitle = document.getElementById('exampleModalLabel')
    const userImg = document.getElementById('avator')
    const userName = document.getElementById('name')
    const userEmail = document.getElementById('email')
    const userRegion = document.getElementById('region')
    const userBday = document.getElementById('birthday')

    axios
      .get(indexUrl + id)
      .then(response => {
        const user = response.data
        userTitle.textContent = `ID Number # ${user.id}`
        userImg.src = `${user.avatar}`
        userName.textContent = user.surname + user.name
        userEmail.innerHTML = `
        <i class="fas fa-paper-plane"></i>${user.email}`
        userRegion.innerHTML = `<i class="fas fa-globe-asia"></i>${user.region} `
        userBday.innerHTML = `<i class="fas fa-birthday-cake"></i>${user.birthday}`
      })
      .catch(error => {
        console.log(error)
      })
  }

})()

