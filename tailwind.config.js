// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-hero-gradient":
          "linear-gradient(90deg, #360D6C 30%, #BF0B47 84%)",
      },
    },
  },
  plugins: [],
};
