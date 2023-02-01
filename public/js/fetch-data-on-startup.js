(async () => {
  try {
    const res = await fetch('http://127.0.0.1:3000/saved');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
})();
