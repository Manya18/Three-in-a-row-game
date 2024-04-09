export function createPage() {
  components.container.style.backgroundColor = config.containerColorBG;
  components.container.style.height = "100vh";
  components.container.style.overflow = "hidden";
  components.container.style.display = "flex";
  components.container.style.alignItems = "center";
  components.container.style.justifyContent = "center";

  document.body.append(components.container);
}
