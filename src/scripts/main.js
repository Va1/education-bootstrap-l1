import $ from 'jquery';
import _ from 'lodash';
import 'bootstrap-sass';
import { getProductsForCategory } from './products';

const productTemplate = _.template(`
<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 bw-grid-product">
    <img class="bw-grid-product-image"
         src="http://placehold.it/500x500" />
    <span class="bw-grid-product-title">
        <%= title %>
    </span>
    <span class="bw-grid-product-price">
        $<%= price %>
    </span>
</div>
`);

$(window.document).ready(() => {
  const $tabHandles = $('a[data-toggle="tab"]');

  $tabHandles.on('show.bs.tab', (event) => {
    const $tabHandle = $(event.target);
    const category = $tabHandle.data('category');
    const $tabContent = $('#' + category + ' .row');

    getProductsForCategory(category)
      .then((products) => {
        let productsHtml = '';

        products.forEach((product) => {
          productsHtml += productTemplate(product);
        });

        $tabContent.html(productsHtml);
      });
  });

  $tabHandles.on('hide.bs.tab', (event) => {
    const $tabHandle = $(event.target);
    const category = $tabHandle.data('category');
    const $tabContent = $('#' + category + ' .row');

    $tabContent.html('');
  });
});
