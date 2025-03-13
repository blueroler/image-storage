let footer = '';
footer = `
    <p>&copy; 2024 Daily News</p>
    `;

document.getElementById('footer').innerHTML = footer;

const style_footer = document.createElement("style");
style_footer.innerHTML = `
#footer {
  background-color: #036;
  color: #fff;
  text-align: center;
  padding: 1rem;
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
}
`;

document.head.appendChild(style_footer);