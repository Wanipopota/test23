import { gql } from '@apollo/client';

export const QUERY_PRODUCTS = gql`
  query getProducts {
    products {
      _id
      name
      description
      price
      quantity
      image
      comments {
        commentText
        username
        createdAt
      }
    }
  }
`;

export const QUERY_CHECKOUT = gql`
  query getCheckout($products: [ProductInput]) {
    checkout(products: $products) {
      session
    }
  }
`;

export const QUERY_ALL_PRODUCTS = gql`
  {
    products {
      _id
      name
      description
      price
      quantity
      comments {
        commentText
        username
        createdAt
      }
    }
  }
`;

export const QUERY_USER = gql`
  {
    user {
      firstName
      lastName
      orders {
        _id
        purchaseDate
        products {
          _id
          name
          description
          price
          quantity
          image
        }
      }
    }
  }
`;

export const QUERY_PRODUCT_BY_ID = gql`
  query getProduct($id: ID!) {
    product(_id: $id) {
      _id
      name
      description
      price
      quantity
      image
      comments {
        commentText
        username
        createdAt
      }
    }
  }
`;