export const getThemeByCategory = (category) => {
  const themes = {
    hidrologi: {
      bg: 'bg-blue-500',
      text: 'text-blue-500',
      border: 'border-blue-500'
    },
    hidrometeorologi: {
      bg: 'bg-green-500',
      text: 'text-green-500',
      border: 'border-green-500'
    },
    hidrogeologi: {
      bg: 'bg-amber-500',
      text: 'text-amber-500',
      border: 'border-amber-500'
    }
  };

  return themes[category.toLowerCase()] ?? themes.hidrologi;
};
