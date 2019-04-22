const sections = document.querySelectorAll('section');
const turret = document.getElementById('tank_turret');

const moveTank = document.querySelector('.art-tank-fw.parallax-ultra-fore');

for (const section of sections) {
  section.addEventListener('mouseenter', e => {
    const turretDirection = e.target.dataset.turretDirection;
    turret.classList.add(`tank_turret__${turretDirection}`);
  });

  section.addEventListener('mouseleave', e => {
    const turretDirection = e.target.dataset.turretDirection;
    turret.classList.remove(`tank_turret__${turretDirection}`);
  });
}

sections[0].addEventListener('click', e => {
  document.body.className = 'toggle';
});

// document.addEventListener('scroll', e => {
//   console.log(e);
// });

sections[0].onscroll = e => {
  const offset = moveTank.getBoundingClientRect().bottom - e.target.scrollTop;
  moveTank.style.transform = `translateZ(40px) scale(.87) translateX(${-1 * offset}px)`;
};
