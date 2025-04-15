document.addEventListener("DOMContentLoaded", () => {
    const title = document.querySelector(".title");
    const intro = document.querySelector(".intro");
  
    title.addEventListener("mouseover", () => {
      title.style.color = "#FF6F61";
    });
  
    title.addEventListener("mouseout", () => {
      title.style.color = "#FF4B2B";
    });
  
    intro.addEventListener("click", () => {
      alert("A desigualdade social precisa ser enfrentada por todos. Vamos juntos nessa luta!");
    });
  });
  