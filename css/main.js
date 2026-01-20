const themebtn = document.querySelector('.navbar__btn');
const icon = themebtn.querySelector('i');

themebtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    
    // toogle icon
    if (document.body.classList.contains('dark')) {
        icon.classList.remove('uil-moon');
        icon.classList.add('uil-sun');
    } else {
        icon.classList.remove('uil-sun');
        icon.classList.add('uil-moon');
    }
})



const sidebarOpenBtn = document.querySelector('.sidebar__toggle-open');
const sidebarCloseBtn = document.querySelector('.sidebar__toggle-close');
const sidebar = document.querySelector('.sidebar');

sidebarOpenBtn.addEventListener('click' , () => {
    sidebar.style.left = "0";
    sidebarCloseBtn.style.display = "inline-block";
    sidebarOpenBtn.style.display = "none";
})

sidebarCloseBtn.addEventListener('click' , () => {
    sidebar.style.left = "-100%";
    sidebarCloseBtn.style.display = "none";
    sidebarOpenBtn.style.display = "inline-block";
})


  const chart = document.getElementById('chart');

  new Chart(chart, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'this month sales',
        data: [1200, 1900, 3000, 5000, 2300, 3400, 2900, 4100, 3800, 4500, 5200, 6000],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  const pieChart = document.querySelector("#categories");

  const data = {
    datasets: [
        {
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            data: [25, 20, 15, 10, 30]
        }
    ]
  }

  new Chart(pieChart, {
    type: 'pie',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
        position: 'top',
      },
      title: {
        display: true,
        
      }
    }
  },
  });