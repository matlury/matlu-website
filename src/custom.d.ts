declare module "*.module.scss" {
  const content: { [className: string]: string };
  export default content;
}

declare module "*.png" {
  const value: import("next/image").StaticImageData;
  export default value;
}

declare module "*.jpg" {
  const value: import("next/image").StaticImageData;
  export default value;
}
