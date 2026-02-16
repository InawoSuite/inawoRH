const getChartColorsArray = (colors) => {
  if (!colors || typeof colors !== "string") {
    console.warn("getChartColorsArray: colors est vide ou invalide →", colors);
    return ["#727cf5"]; // couleur de secours
  }

  try {
    const parsedColors = JSON.parse(colors);

    if (!Array.isArray(parsedColors)) {
      throw new Error("getChartColorsArray attend un tableau JSON");
    }

    return parsedColors.map(function (value) {
      const newValue = value.replace(/\s/g, "");

      if (!newValue.includes(",")) {
        let color = getComputedStyle(document.documentElement).getPropertyValue(newValue);

        if (color && color.includes("#")) {
          return color.trim();
        }

        return color.trim() || newValue;
      } else {
        const val = newValue.split(",");

        if (val.length === 2) {
          let baseColor = getComputedStyle(document.documentElement).getPropertyValue(val[0]);
          baseColor = baseColor.trim();
          return `rgba(${baseColor},${val[1]})`;
        }

        return newValue;
      }
    });
  } catch (error) {
    console.error("Erreur dans getChartColorsArray:", error);
    return ["#727cf5"]; // fallback de secours
  }
};

export default getChartColorsArray;
