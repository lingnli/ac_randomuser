(function () {

  const baseUrl = 'https://lighthouse-user-api.herokuapp.com'
  const indexUrl = baseUrl + '/api/v1/users/'
  const data = []
  const dataPanel = document.getElementById('data-panel')
  const searchBar = document.getElementById('search-bar')
  const searchInput = document.querySelector('#search-input')
  const navBar = document.querySelector('#navbar')
  const modeBtn = document.querySelector('.mode-btn')
  const pageNav = document.getElementById('pagination')
  const perPageItem = 20 //每頁產生10比user
  let htmlContemt = ''
  let page = 1//初始設定為1
  let mode = 'card'

  //串API
  axios
    .get(indexUrl)
    .then((response) => {
      console.log(...response.data.results)
      data.push(...response.data.results)
      totalPages(data)
      displayPageList(1, data)
    })
    .catch((error) => {
      console.log(error)
    })

  //監控datapanel
  dataPanel.addEventListener('click', event => {
    if ((event.target.matches('.img')) || ((event.target.matches('.more')))) {
      console.log(event.target.dataset.id)
      userDetails(event.target.dataset.id)

    } else if (event.target.matches('.btn-outline-danger')) {
      event.target.classList.toggle('new-style')//若已加到清單則更改樣式為填滿
      addToLikes(event.target.dataset.id)
    }
  })

  //監控seachbar
  searchBar.addEventListener('submit', event => {
    event.preventDefault()
    let results = []

    const regex = new RegExp(searchInput.value, 'i')
    results = data.filter(user => user.name.match(regex))
    console.log(results)
    displayPageList(1, results)
    searchInput.value = ''
  })

  //監控mode btn
  modeBtn.addEventListener('click', event => {
    if (event.target.matches('.fa-bars')) {
      mode = event.target.dataset.type
      displayPageList(page)
    } else if (event.target.matches('.fa-th')) {
      mode = event.target.dataset.type
      displayPageList(page)
    }
  })


  //監控navbar的男女分類
  navBar.addEventListener('click', event => {
    if (event.target.matches('.male')) {//找男生
      let maleData = data.filter(user => user.gender === 'male')
      totalPages(maleData)
      displayPageList(1, maleData)
    } else if (event.target.matches('.female')) {//找女生
      let femaleData = data.filter(user => user.gender === 'female')
      totalPages(femaleData)
      displayPageList(1, femaleData)
    }
  })

  //監聽分頁
  pageNav.addEventListener('click', event => {

    if (event.target.matches('.page-link')) {
      console.log(event.target.dataset.page)
      displayPageList(event.target.dataset.page)
      page = event.target.dataset.page //更新初始設定為1的page
    }
  })

  //把抓到indexAPI丟進去
  function diaplayUserList(data) {
    htmlContemt = ''

    if (mode === 'card') {
      data.forEach(element => {

        //需要判別部分條件式分開寫
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
                <button type="button" class="old-style btn btn-outline-danger" data-id="${element.id}">Like</button>
            </div>
          </div>
        `
      })
    } else if (mode === 'list') {

      htmlContemt = `<ul class="list-group">`

      data.forEach(user => {
        if (user.gender === 'male') {
          htmlContemt += `
        <li class="list-group-item"><p><i class="fas fa-male"> ${user.name} ${user.surname}</i></p>
                 <button type="button" class="list-like old-style btn btn-outline-danger" data-id="${user.id}">Like</button>
                <button class="list-more btn btn-info" data-id="${user.id}" data-toggle="modal" data-target="#exampleModal">More</button>
        </li>
        `
        } else if (user.gender === 'female') {
          htmlContemt += `
        <li class="list-group-item"><p><i class="fas fa-female"> ${user.name} ${user.surname}</i></p>
                 <button type="button" class="list-like old-style btn btn-outline-danger" data-id="${user.id}">Like</button>
                <button class="list-more btn btn-warning" data-id="${user.id}" data-toggle="modal" data-target="#exampleModal">More</button>
        </li>
        `
        }
      })
      htmlContemt += `</ul>`
    }

    dataPanel.innerHTML = htmlContemt
  }

  //加到最愛功能
  function addToLikes(id) {
    const likeList = JSON.parse(localStorage.getItem('list')) || []
    const user = data.find(item => item.id === Number(id))

    if (likeList.some(item => item.id === Number(id))) {
      alert("You already addedd it!")
    } else {
      likeList.push(user)
    }
    localStorage.setItem('list', JSON.stringify(likeList))//更新localStorage中list的內容
    console.log(localStorage.getItem('list'))
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

  //計算頁數
  function totalPages(data) {
    let totalPagesNum = Math.ceil(data.length / perPageItem) || 1 //產生頁數為n或1(1防呆)
    let pagehtmlContent = ``

    for (let i = 0; i < totalPagesNum; i++) {
      pagehtmlContent += `
      <li class="page-item">
        <a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a>
      </li>`
    }
    pageNav.innerHTML = pagehtmlContent
  }

  let paginationData = []
  //印出特定頁數
  function displayPageList(page, data) {
    paginationData = data || paginationData
    let cutpoint = (page - 1) * perPageItem
    //page從1開始，第一頁顯示1~20的資料
    let pageData = paginationData.slice(cutpoint, cutpoint + perPageItem)
    //slice含頭不含尾，且不更改原本data
    diaplayUserList(pageData)
  }
})()

//待修正！
//like按鈕按下後，跳換頁面like按鈕樣式會消失？
//mode btn切換有樣式 才可以得知現在在哪種樣式
//page頁數有樣式 同上
//menu加入樣式
