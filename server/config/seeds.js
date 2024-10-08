const db = require('./connection');
const { User, Product } = require('../models');
const cleanDB = require('./cleanDB');

db.once('open', async () => {
  await cleanDB('Product', 'products');
  await cleanDB('User', 'users');

  const products = await Product.insertMany([
    {
      name: 'Tool Chair',
      description:
        'This new product is an office chair with tools attached to the sides so you can repair anything',
      image: 'tool-chair.jpg',
      price: 199.99,
      quantity: 30,
      comments: [
        {
          commentText: 'This chair is a lifesaver for fixing things around the house!',
          username: 'Pamela',
          createdAt: new Date(),
        },
        {
          commentText: 'Great for DIY projects. Very convenient.',
          username: 'Elijah',
          createdAt: new Date(),
        },
      ],
    },
    {
      name: 'Tales at Bedtime',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ornare diam quis eleifend rutrum. Aliquam nulla est, volutpat non enim nec, pharetra gravida augue. Donec vitae dictum neque. Pellentesque arcu lorem, fringilla non ligula ac, tristique bibendum erat. Ut a semper nibh. Quisque a mi et mi tempor ultricies. Maecenas eu ipsum eu enim hendrerit accumsan at euismod urna.',
      image: 'bedtime-book.jpg',
      price: 9.99,
      quantity: 100,
      comments: [
        {
          commentText: 'My kids love this book. A must-read before bed!',
          username: 'Elijah',
          createdAt: new Date(),
        },
      ],
    },
    {
      name: 'Spinning Top',
      description: 'Ut vulputate hendrerit nibh, a placerat elit cursus interdum.',
      image: 'spinning-top.jpg',
      price: 1.99,
      quantity: 1000,
    },
    {
      name: 'Set of Plastic Horses',
      description:
        'Sed a mauris condimentum, elementum enim in, rhoncus dui. Phasellus lobortis leo odio, sit amet pharetra turpis porta quis.',
      image: 'plastic-horses.jpg',
      price: 2.99,
      quantity: 1000,
    },
    {
      name: 'Teddy Bear',
      description:
        'Vestibulum et erat finibus erat suscipit vulputate sed vitae dui. Ut laoreet tellus sit amet justo bibendum ultrices. Donec vitae felis vestibulum, congue augue eu, finibus turpis.',
      image: 'teddy-bear.jpg',
      price: 7.99,
      quantity: 100,
      comments: [
        {
          commentText: 'Super soft and cuddly. My child loves it!',
          username: 'Pamela',
          createdAt: new Date(),
        },
      ],
    },
    {
      name: 'Alphabet Blocks',
      description:
        'Morbi consectetur viverra urna, eu fringilla turpis faucibus sit amet. Suspendisse potenti. Donec at dui ac sapien eleifend hendrerit vel sit amet lectus.',
      image: 'alphabet-blocks.jpg',
      price: 9.99,
      quantity: 600,
    },
  ]);

  console.log('products seeded');

  await User.create({
    firstName: 'Pamela',
    lastName: 'Washington',
    email: 'pamela@testmail.com',
    password: 'password12345',
    orders: [
      {
        products: [products[0]._id, products[0]._id, products[1]._id],
      },
    ],
  });

  await User.create({
    firstName: 'Elijah',
    lastName: 'Holt',
    email: 'eholt@testmail.com',
    password: 'password12345',
  });

  console.log('users seeded');

  process.exit();
});
