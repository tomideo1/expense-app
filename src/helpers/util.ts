

export const formatNumber = (num: number) => {
  return num.toLocaleString('en-US', { style: 'currency', currency: 'NGN' });
};

