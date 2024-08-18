document.addEventListener('DOMContentLoaded', function() {
  showLoader();
})

function showLoader() {
  document.getElementById("loader").style.display = "flex";
  document.body.style.overflow = 'hidden'
}

function hideLoader() {
  document.getElementById("loader").style.display = "none";
  document.body.style.overflowY = 'auto'
}


window.addEventListener('load', () => {
  hideLoader();
});

document.addEventListener('DOMContentLoaded', function () {
  fetch('/getuser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      updateuseractivity()
      updateuserdata(data)
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });

  function updateuserdata(data) {
    const userDetailsDiv = document.querySelector('.userprofilediv');
    const secondblock = document.querySelector('.second-block')

    const userProfileImg = document.createElement('img');
    const usernameParagraph = document.createElement('p');

    userProfileImg.src = data.photo.data;
    userProfileImg.alt = "User Profile Image";
    usernameParagraph.textContent = data.firstName + ' ' + data.lastName;

    userDetailsDiv.appendChild(userProfileImg);
    secondblock.appendChild(usernameParagraph);
  }

  async function updateuseractivity() {

    const swipemade = document.getElementById('swipemade')
    const likereceived = document.getElementById('likereceived')
    const dislikereceived = document.getElementById('dislikereceived')

    const response = await fetch('/getswipedata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    const userdata = await response.json();
    const { swipesMade, likesReceived, dislikesReceived } = userdata;

    swipemade.textContent = swipesMade || 0;
    likereceived.textContent = likesReceived || 0;
    dislikereceived.textContent = dislikesReceived || 0;
  }

  function activelogoutcontainer() {
    const otppopup = document.getElementById("logout-popup");
    otppopup.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function deactivatelogoutcontainer() {
    const otppopup = document.getElementById("logout-popup");
    otppopup.style.display = "none";
    document.body.style.overflow = "auto";
  }

  const logout = document.getElementById('logout')
  logout.addEventListener('click', function () {
    activelogoutcontainer()
  })

  const logoutbtn2 = document.getElementById('logout-btn2')
  logoutbtn2.addEventListener('click', function () {
    deactivatelogoutcontainer()
  })

  const logoutbtn1 = document.getElementById('logout-btn1')
  logoutbtn1.addEventListener('click', function () {
    logoutuser()
  })

  async function logoutuser() {
    
    const response = await fetch('/logoutuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }

    window.location.href = '/'
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const editprofile = document.getElementById("editprofile")
  const getpremium = document.getElementById("getpremium")

  editprofile.addEventListener("click", function () {
    window.location.href = '/editprofile'
  })

  getpremium.addEventListener("click", function () {
    window.location.href = '/premium'
  })
})
