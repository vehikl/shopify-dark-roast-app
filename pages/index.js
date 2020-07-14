import { Page } from '@shopify/polaris';
import store from 'store-js';
import ResourceListWithProducts from '../components/ResourceList';

class Index extends React.Component {
  state = { open: false };
  render() {
    return (
      <Page
        primaryAction={{
          content: 'Edit products',
          onAction: () => this.setState({ open: true }),
        }}
      >
        <ResourceListWithProducts />
      </Page>
    );
  }

  handleSelection = (resources) => {
    const idsFromResources = resources.selection.map((product) => product.id);
    this.setState({ open: false });
    store.set('ids', idsFromResources);
  };
}

export default Index;
