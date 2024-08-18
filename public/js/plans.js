const weeklyData = [
  { type: "Iron", duration: "1 Week", likes: 100, chats: 10, price: "₹ 300" },
  { type: "Silver", duration: "1 Week", likes: 140, chats: 15, price: "₹ 400" },
  { type: "Gold", duration: "1 Week", likes: 250, chats: 30, price: "₹ 700" },
  { type: "Platinum", duration: "1 Week", likes: "Unlimited", chats: "Unlimited", price: "₹ 1199" }
];

const monthlyData = [
  { type: "Iron", duration: "1 Month", likes: 100, chats: 10, price: "₹ 899" },
  { type: "Silver", duration: "1 Month", likes: 600, chats: 100, price: "₹ 1199" },
  { type: "Gold", duration: "1 Month", likes: 1000, chats: 200, price: "₹ 1399" },
  { type: "Platinum", duration: "1 Month", likes: "Unlimited", chats: "Unlimited", price: "₹ 1799" }
];

const quarterlyData = [
  { type: "Iron", duration: "3 Months", likes: 100, chats: 10, price: "₹ 1799" },
  { type: "Silver", duration: "3 Months", likes: 600, chats: 100, price: "₹ 2499" },
  { type: "Gold", duration: "3 Months", likes: 1000, chats: 200, price: "₹ 3999" },
  { type: "Platinum", duration: "3 Months", likes: "Unlimited", chats: "Unlimited", price: "₹ 5999" }
];

function updateBoxContainers(data) {
  const container = document.querySelector('.box-container');
  const boxes = container.querySelectorAll('.box-container > div');

  boxes.forEach((box, index) => {
    const details = box.querySelector('.detail');
    details.style.transition = "opacity 0.5s, transform 0.5s";
    details.style.opacity = "0";
    details.style.transform = "translateY(-20px)";

    setTimeout(() => {
      const newData = data[index];
      details.innerHTML = `
                <p>${newData.duration}</p>
                <p>${newData.likes} likes & dislikes</p> 
                <p> ${newData.chats} chats</p>
                <p>${newData.price}</p>
            `;
      details.style.opacity = "1";
      details.style.transform = "translateY(0)";
    }, 500);
  });

  container.classList.add('shuffling');

  setTimeout(() => {
    container.classList.remove('shuffling');
  }, 1000);
}

document.querySelector('.Month').addEventListener('click', function () {
  updateBoxContainers(monthlyData);
});

document.querySelector('.Month').addEventListener('click', function () {
  updateBoxContainers(monthlyData);
  this.classList.add('active');
  document.querySelector('.Week').classList.remove('active');
  document.querySelector('.Quarter').classList.remove('active');
});

document.querySelector('.Quarter').addEventListener('click', function () {
  updateBoxContainers(quarterlyData);
  this.classList.add('active');
  document.querySelector('.Week').classList.remove('active');
  document.querySelector('.Month').classList.remove('active');
});

document.querySelector('.Week').addEventListener('click', function () {
  updateBoxContainers(weeklyData);
  this.classList.add('active');
  document.querySelector('.Month').classList.remove('active');
  document.querySelector('.Quarter').classList.remove('active');
});

updateBoxContainers(weeklyData);
document.querySelector('.Week').classList.add('active');

function scrolltotop() {
  const targetPixelPosition = 1;
  window.scroll({ top: targetPixelPosition, left: 0, behavior: 'smooth' });
}