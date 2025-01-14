ModAPI.meta.title("Furnace");
ModAPI.meta.description("Mod library that downloads mods so you don't have to.");
const furnaceIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAF9JREFUOE9j/L895D8DCLy9CqaIBsLaYKWMYAPurCFaH4pClRAGxv9LNP8zvL/OwJhLmhn/JzMwMAhqYjcALIkFIFtC0ABCLqK9AcPACwMfiAPrAmISNSIhUZyZKMzOAFUyebm4ycV4AAAAAElFTkSuQmCC";
ModAPI.meta.icon(furnaceIcon);
ModAPI.meta.credits("By Jxo");

// Prompt for mode (online or offline)
const mode = confirm("Would you like to use online mode? Click 'Cancel' for offline mode.") ? 'online' : 'offline';
const iconUrl = mode === 'online'
  ? 'https://jfurnace.netlify.app/assets/icons/icon.png'
  : 'assets/icons/icon.png';

// Show alert with instructions
alert("Press Ctrl + Shift + F to open the menu");

// Create the floating menu container
const menu = document.createElement('div');
menu.id = 'menu';
menu.style.cssText = `
  position: fixed;
  top: 0;
  right: -100%;
  width: 350px;
  height: 100%;
  background-color: #1e1e1e;
  color: #ddd;
  padding: 20px;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.5);
  transition: right 0.4s ease;
  z-index: 1000;
  overflow-y: auto;
  border-left: 1px solid orange;
`;

// Menu header with icon and title
const header = document.createElement('div');
header.style.cssText = `
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const icon = document.createElement('img');
icon.src = iconUrl;
icon.alt = "Furnace Icon";
icon.style.cssText = `
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const title = document.createElement('span');
title.textContent = "Furnace";
title.style.cssText = `
  font-size: 24px;
  font-weight: bold;
  color: orange;
`;

header.appendChild(icon);
header.appendChild(title);
menu.appendChild(header);

// Category bar for filtering mods
const categoryBar = document.createElement('div');
categoryBar.id = 'category-bar';
categoryBar.style.cssText = `
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 10px;
  border-bottom: 1px solid #555;
  margin-bottom: 20px;
`;
menu.appendChild(categoryBar);

// Append the menu to the document body
document.body.appendChild(menu);

// Fetch mods.json based on mode
const modsUrl = mode === 'online'
  ? 'https://jfurnace.netlify.app/assets/mods/mods.json'
  : 'assets/mods/mods.json';

fetch(modsUrl)
  .then(response => response.json())
  .then(mods => {
    const categories = new Set();
    const modContainers = [];

    // Create mod entries for each mod in the list
    mods.forEach(mod => {
      const modContainer = document.createElement('div');
      modContainer.style.cssText = `
        margin-bottom: 15px;
        padding: 15px;
        border: 1px solid orange;
        border-radius: 5px;
        background-color: #333;
        text-align: center;
      `;

      const modImg = document.createElement('img');
      modImg.src = mod.image;
      modImg.alt = mod.name;
      modImg.style.cssText = `
        width: 50px;
        height: 50px;
        margin-bottom: 5px;
        border-radius: 5px;
        border: 1px solid orange;
      `;

      const modName = document.createElement('span');
      modName.textContent = mod.name;
      modName.style.cssText = `
        font-size: 16px;
        color: orange;
        display: block;
        margin-bottom: 5px;
      `;

      const modAuthor = document.createElement('p');
      modAuthor.textContent = `By: ${mod.author || 'Unknown'}`;
      modAuthor.style.cssText = `
        font-size: 12px;
        color: #aaa;
        margin: 5px 0;
      `;

      const modDescription = document.createElement('p');
      modDescription.textContent = mod.description || "No description provided.";
      modDescription.style.cssText = `
        font-size: 12px;
        color: #ccc;
        margin-bottom: 10px;
      `;

      const modApi = document.createElement('p');
      modApi.textContent = `API: ${mod.api || 'No API provided'}`;
      modApi.style.cssText = `
        font-size: 12px;
        color: #ddd;
        margin-bottom: 5px;
      `;

      const modButton = document.createElement('button');
      modButton.textContent = 'Install';
      modButton.style.cssText = `
        padding: 5px 10px;
        background-color: orange;
        color: black;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 14px;
      `;

      modButton.addEventListener('click', () => {
        if (modButton.textContent === 'Install') {
          const modScript = document.createElement('script');
          modScript.src = mod.scriptUrl;
          modScript.onload = () => {
            alert(`${mod.name} has been installed and is now active.`);
          };
          modScript.onerror = () => {
            alert(`Failed to load ${mod.name}. Please try again.`);
          };
          document.head.appendChild(modScript);

          modButton.textContent = 'Refresh to Remove';
          modButton.style.backgroundColor = '#555';
          modButton.style.color = '#ddd';
        }
      });

      modContainer.appendChild(modImg);
      modContainer.appendChild(modName);
      modContainer.appendChild(modAuthor);
      modContainer.appendChild(modDescription);
      modContainer.appendChild(modApi);
      modContainer.appendChild(modButton);
      menu.appendChild(modContainer);

      modContainers.push({
        container: modContainer,
        name: mod.name.toLowerCase(),
        category: mod.category?.toLowerCase()
      });

      if (mod.category) {
        categories.add(mod.category.toLowerCase());
      }
    });

    // Add category buttons to the category bar
    categories.forEach(category => {
      const categoryButton = document.createElement('button');
      categoryButton.textContent = category;
      categoryButton.style.cssText = `
        padding: 5px 10px;
        background-color: #555;
        color: #ddd;
        border: none;
        border-radius: 3px;
        cursor: pointer;
      `;

      categoryButton.addEventListener('click', () => {
        modContainers.forEach(mod => {
          mod.container.style.display = mod.category === category ? 'block' : 'none';
        });
      });

      categoryBar.appendChild(categoryButton);
    });
  })
  .catch(error => {
    console.error('Failed to load mods:', error);
  });

let menuOpen = false;
window.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
    menuOpen = !menuOpen;
    menu.style.right = menuOpen ? '0' : '-100%';
  }
});
