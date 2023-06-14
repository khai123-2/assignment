require('@babel/register')({
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@': './src', // replace ./src with the path to the directory where your "@" alias points to
        },
      },
    ],
  ],
});
