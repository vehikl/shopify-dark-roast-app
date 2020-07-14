import {
  Banner,
  Card,
  DisplayText,
  Form,
  FormLayout,
  Frame,
  Layout,
  Page,
  PageActions,
  TextField,
  Toast,
} from '@shopify/polaris';
import store from 'store-js';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const UPDATE_METAFIELD = gql`
 mutation($input: PrivateMetafieldInput!) {
  privateMetafieldUpsert(input: $input) {
    privateMetafield {
      namespace
      key
      value
    }
  }
}
`;

class EditProduct extends React.Component {
  state = {
    parentTitle: '',
    costPerMonth: '',
    variantId: '',
    showToast: false,
  };

  componentDidMount() {
    this.setState(this.itemToBeConsumed());
  }

  render() {
    const { name, parentTitle, variantId, costPerMonth } = this.state;
    return (
      <Mutation
        mutation={UPDATE_METAFIELD}
      >
        {(handleSubmit, { error, data }) => {
          const showError = error && (
            <Banner status="critical">{error.message}</Banner>
          );
          const showToast = data && data.productVariantUpdate && (
            <Toast
              content="Sucessfully updated"
              onDismiss={() => this.setState({ showToast: false })}
            />
          );
          return (
            <Frame>
              <Page>
                <Layout>
                  {showToast}
                  <Layout.Section>
                    {showError}
                  </Layout.Section>
                  <Layout.Section>
                    <DisplayText size="large">{parentTitle}: {name}</DisplayText>
                    <Form>
                      <Card sectioned>
                        <FormLayout>
                          <FormLayout.Group>
                            <TextField
                              value={costPerMonth}
                              label="Cost Per Month"
                              type="price"
                              onChange={this.handleChange('costPerMonth')}
                            />
                          </FormLayout.Group>
                        </FormLayout>
                      </Card>
                      <PageActions
                        primaryAction={[
                          {
                            content: 'Save',
                            onAction: () => {
                              const productVariableInput = {
                                owner: variantId,
                                namespace: "coffee",
                                key: "cost_per_month",
                                valueInput: {
                                  value: costPerMonth,
                                  valueType: "STRING"
                                }
                              };
                              handleSubmit({
                                variables: { input: productVariableInput },
                              });
                            },
                          },
                        ]}
                      />
                    </Form>
                  </Layout.Section>
                </Layout>
              </Page>
            </Frame>
          );
        }}
      </Mutation>
    );
  }

  handleChange = (field) => {
    return (value) => this.setState({ [field]: value });
  };

  itemToBeConsumed = () => {
    const item = store.get('item');
    // TODO: Modify this to fetch value(s) of metafield(s) and return
    return {
      parentTitle: item.parentTitle,
      variantId: item.id,
      name: item.title,
      costPerMonth: ''
    };
  };
}

export default EditProduct;
