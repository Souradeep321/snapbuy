import React from 'react'
import ProductListingPage from '../../components/common/ProductListingPage'

const Womens = () => {

  const products = [
    {
      "coverImage": {
        "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1751722693/rgdrfdxbuqo258sv1orp.jpg",
        "public_id": "rgdrfdxbuqo258sv1orp"
      },
      "_id": "68692ac4d5b80404b0c965e9",
      "name": "Men’s Beige Basic Tee",
      "description": "A minimal and versatile beige t-shirt for everyday styling. Lightweight and soft.",
      "price": 1233,
      "gender": "male",
      "category": "clothing",
      "subCategory": "tshirts",
      "additionalImages": [
        {
          "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1751722694/i6qq83seaonkiqiui2co.jpg",
          "public_id": "i6qq83seaonkiqiui2co",
          "_id": "68692ac4d5b80404b0c965ea"
        },
        {
          "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1751722695/r0igt3ba5wfp9msyji2o.jpg",
          "public_id": "r0igt3ba5wfp9msyji2o",
          "_id": "68692ac4d5b80404b0c965eb"
        }
      ],
      "countInStock": 20,
      "isFeatured": true,
      "ratings": 0,
      "reviews": [],
      "createdAt": "2025-07-05T13:38:12.096Z",
      "updatedAt": "2025-07-07T16:57:31.713Z",
      "__v": 0
    },
    {
      "coverImage": {
        "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1751695918/fcnwbgyuhn58lky7s1jg.webp",
        "public_id": "fcnwbgyuhn58lky7s1jg"
      },
      "_id": "6868c22ddc12df21acd8c005",
      "name": "Denim Button-Up Shirt",
      "description": "Classic button-up denim shirt with chest pockets and faded texture for a rugged look.",
      "price": 1799,
      "gender": "male",
      "category": "clothing",
      "subCategory": "shirts",
      "additionalImages": [
        {
          "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1751695919/lmlrpgqnmosfgqndc6yf.webp",
          "public_id": "lmlrpgqnmosfgqndc6yf",
          "_id": "6868c22ddc12df21acd8c006"
        },
        {
          "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1751695920/myavmxn4n9jrlxfj2x3b.webp",
          "public_id": "myavmxn4n9jrlxfj2x3b",
          "_id": "6868c22ddc12df21acd8c007"
        }
      ],
      "countInStock": 15,
      "isFeatured": true,
      "ratings": 0,
      "reviews": [],
      "createdAt": "2025-07-05T06:11:57.172Z",
      "updatedAt": "2025-07-06T08:59:59.145Z",
      "__v": 0
    },
    {
      "coverImage": {
        "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1751695744/pwlvgn1zzsfio68q7yyx.webp",
        "public_id": "pwlvgn1zzsfio68q7yyx"
      },
      "_id": "6868c17fdc12df21acd8bfe4",
      "name": "Men's Formal White Shirt",
      "description": "Elegant white formal shirt with crisp collar and premium finish, perfect for office and events.",
      "price": 1499,
      "gender": "male",
      "category": "clothing",
      "subCategory": "shirts",
      "additionalImages": [
        {
          "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1751695745/s1relkeebidazw4gyrtr.webp",
          "public_id": "s1relkeebidazw4gyrtr",
          "_id": "6868c17fdc12df21acd8bfe5"
        },
        {
          "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1751695746/ks4iosjtxpsdwz5jqaz9.webp",
          "public_id": "ks4iosjtxpsdwz5jqaz9",
          "_id": "6868c17fdc12df21acd8bfe6"
        },
        {
          "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1751695747/y1rvijmahgdb0isfug0v.webp",
          "public_id": "y1rvijmahgdb0isfug0v",
          "_id": "6868c17fdc12df21acd8bfe7"
        }
      ],
      "countInStock": 15,
      "isFeatured": true,
      "ratings": 0,
      "reviews": [],
      "createdAt": "2025-07-05T06:09:03.705Z",
      "updatedAt": "2025-07-06T11:22:52.224Z",
      "__v": 0
    },
    {
      "coverImage": {
        "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1750853267/csu4btq0utgo6rmmpias.webp",
        "public_id": "csu4btq0utgo6rmmpias"
      },
      "_id": "685be695e6ec97659d819b8f",
      "name": "Nike Air Max",
      "description": "Stylish and comfortable running shoes.",
      "price": 6999,
      "gender": "male",
      "category": "footwear",
      "subCategory": "sneakers",
      "additionalImages": [
        {
          "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1750853268/em1sutubvorhflob2k7r.webp",
          "public_id": "em1sutubvorhflob2k7r",
          "_id": "685be695e6ec97659d819b90"
        },
        {
          "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1750853269/y1objhvzibwyqwpjal1l.webp",
          "public_id": "y1objhvzibwyqwpjal1l",
          "_id": "685be695e6ec97659d819b91"
        }
      ],
      "countInStock": 30,
      "isFeatured": true,
      "ratings": 0,
      "reviews": [],
      "createdAt": "2025-06-25T12:07:49.010Z",
      "updatedAt": "2025-07-06T11:26:50.588Z",
      "__v": 0
    },
    {
      "coverImage": {
        "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1750782190/a3nod1tob4mj2crynqtn.webp",
        "public_id": "a3nod1tob4mj2crynqtn"
      },
      "_id": "685ad0efc04fac61414bdc7b",
      "name": "Men's Slim Fit Cotton Shirt",
      "description": "Premium slim-fit cotton shirt for men. Stylish and comfortable for all seasons.",
      "price": 1299,
      "gender": "unisex",
      "category": "mens-clothing",
      "subCategory": "shirts",
      "additionalImages": [
        {
          "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1750782191/mbt314uba6bpweapwuom.webp",
          "public_id": "mbt314uba6bpweapwuom",
          "_id": "685ad0efc04fac61414bdc7c"
        },
        {
          "url": "https://res.cloudinary.com/dopcijwrw/image/upload/v1750782192/uc4vslskvyrhys5j59g5.webp",
          "public_id": "uc4vslskvyrhys5j59g5",
          "_id": "685ad0efc04fac61414bdc7d"
        }
      ],
      "countInStock": 10,
      "isFeatured": true,
      "ratings": 0,
      "reviews": [],
      "createdAt": "2025-06-24T16:23:11.849Z",
      "updatedAt": "2025-07-06T11:23:10.679Z",
      "__v": 0
    }
  ];

  return (
    <div>
        <ProductListingPage products={products} />
    </div>
  )
}

export default Womens