declare module '*.css' {
  // We don't need to define any exports; this simply tells TypeScript 
  // that importing a .css file is a valid operation.
  // The 'any' type is a common way to handle modules with no defined types.
  const content: any;
  export default content;
}

// You might also want to include other styles if you use them:
declare module '*.scss' {
  const content: any;
  export default content;
}