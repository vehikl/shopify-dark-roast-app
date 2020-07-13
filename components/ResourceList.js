import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import {
  Card,
  ResourceList,
  Stack,
  TextStyle,
  Thumbnail,
} from '@shopify/polaris';
import store from 'store-js';
import { Redirect } from '@shopify/app-bridge/actions';
import { Context } from '@shopify/app-bridge-react';

import * as PropTypes from 'prop-types';

const GET_ALL_PRODUCTS = gql`
  query getProducts {
    products(first: 10) {
      edges {
        node {
          title
          handle
          descriptionHtml
          id
          images(first: 1) {
            edges {
              node {
                originalSrc
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                price
                id
              }
            }
          }
        }
     }
    }
  }
`;

class ResourceListWithProducts extends React.Component {
  static contextType = Context;

  render() {
    const app = this.context;
    const redirectToProduct = () => {
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.APP,
        '/edit-products',
      );
    };

    const twoWeeksFromNow = new Date(Date.now() + 12096e5).toDateString();
    return (
      <Query query={GET_ALL_PRODUCTS}>
        {({ data, loading, error }) => {
          if (loading) { return <div>Loading…</div>; }
          if (error) { return <div>{error.message}</div>; }
          console.log(data);
          stop();
          return (
            <Card>
              <ResourceList
                showHeader
                resourceName={{ singular: 'Product', plural: 'Products' }}
                items={data.products.edges}
                renderItem={(item) => {
                  const media = (
                    <Thumbnail
                      source={
                        item.node.images.edges[0]
                          ? item.node.images.edges[0].node.originalSrc
                          : ''
                      }
                      alt={
                        item.node.images.edges[0]
                          ? item.node.images.edges[0].node.altText
                          : ''
                      }
                    />
                  );
                  const price = item.node.variants.edges[0].node.price;
                  return (
                    <ResourceList.Item
                      id={item.node.id}
                      media={media}
                      accessibilityLabel={`View details for ${item.node.title}`}
                      onClick={() => {
                        store.set('item', item.node);
                        redirectToProduct();
                      }
                      }
                    >
                      <Stack>
                        <Stack.Item fill>
                          <h3>
                            <TextStyle variation="strong">
                              {item.node.title}
                            </TextStyle>
                          </h3>
                        </Stack.Item>
                        <Stack.Item>
                          <p>${price}</p>
                        </Stack.Item>
                        <Stack.Item>
                          <p>Expires on {twoWeeksFromNow} </p>
                        </Stack.Item>
                      </Stack>
                    </ResourceList.Item>
                  );
                }}
              />
            </Card>
          );
        }}
      </Query>
    );
  }
}

export default ResourceListWithProducts;
