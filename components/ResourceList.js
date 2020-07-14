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
          variants(first: 10) {
            edges {
              node {
                price
                id
                title
                privateMetafields(namespace: "coffee", first: 1) {
                    edges {
                     node {
                      id
                      namespace
                      key
                      value
                    }
                  }
                }
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
    const redirectToProductVariant = () => {
      const redirect = Redirect.create(app);
      redirect.dispatch(
        Redirect.Action.APP,
        '/edit-products',
      );
    };

    return (
      <Query query={GET_ALL_PRODUCTS}>
        {({ data, loading, error }) => {
          if (loading) { return <div>Loading…</div>; }
          if (error) { return <div>{error.message}</div>; }
          console.log(data);
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
                  const parentTitle = item.node.title;
                  return (
                    <ResourceList.Item
                      id={item.node.id}
                      media={media}
                    >
                      <Stack>
                        <Stack.Item fill>
                          <h3>
                            <TextStyle variation="strong">
                              {parentTitle}
                            </TextStyle>
                          </h3>
                        </Stack.Item>
                        <Stack.Item>
                          <ResourceList
                              showHeader
                              resourceName={{ singular: 'Product', plural: 'Products' }}
                              items={item.node.variants.edges}
                              renderItem={(item) => {
                                return (
                                    <ResourceList.Item
                                        id={item.node.id}
                                        accessibilityLabel={`View details for ${item.node.title}`}
                                        onClick={() => {
                                          store.set('item', {...item.node, parentTitle});
                                          redirectToProductVariant();
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
                                          <p>${item.node.price}</p>
                                        </Stack.Item>
                                      </Stack>
                                    </ResourceList.Item>
                                );
                              }}
                            />
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
