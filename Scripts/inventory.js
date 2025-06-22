const productsUL = document.querySelector(".products");

// creating an array for the products

let productsarray = [
  ["1", "Sink Cover", "100"],
  ["2", "Hair net", "200"],
  ["3", "Shower Cap", "300"],
  //   { index: ["1", "2", "3"] },
  //   { name: ["Sink Cover", "Hair net", "Shower Cap"] },
  //   { qty: ["100", "200", "300"] },
];

// Creating li item with products

productsarray.forEach(([index, product, qty]) => {
  const productDev = document.createElement("dev");
  const productIndex = document.createElement("li");
  const productName = document.createElement("li");
  const productQty = document.createElement("li");

  // index = () => {
  //   let index = 0;
  //   for (let i = 0; i <= productsarray.length; i++) {
  //     index++;
  //   }
  // };

  productIndex.innerText = index;
  productName.innerText = product;
  productQty.innerText = qty;

  productIndex.setAttribute(
    "class",
    "me-4 hover:underline md:me-6  justify-start"
  );
  productName.setAttribute(
    "class",
    "me-4 hover:underline md:me-6 justify-start"
  );
  productQty.setAttribute(
    "class",
    "me-4 hover:underline md:me-6 justify-start"
  );
  productDev.setAttribute(
    "class",
    "flex flex-row gap-4 items-center m-2 p-2 justify-between max-w-lg text-gray-900 dark:text-white bg-gray-300"
  );

  productsUL.append(productDev);

  productDev.append(productIndex);
  productDev.append(productName);
  productDev.append(productQty);
});
