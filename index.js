const d = document;
const $cards = d.querySelector('#cards');
const $items = d.querySelector('#items');
const $footer = d.querySelector('#footer');
const $templateCard = d.querySelector('#template-card');
const $templateCart = d.querySelector('#template-cart');
const $templateFooter = d.querySelector('#template-footer');
const $fragment = d.createDocumentFragment();
let carrito = {};

d.addEventListener('DOMContentLoaded', () => {
    fetchData();

    if (localStorage.getItem('carro')) {
        carrito = JSON.parse(localStorage.getItem('carro'))
        pintarCart();
    }
});

$cards.addEventListener('click', e => {
    addCarrito(e);
});

$items.addEventListener('click', (e) => {
    btn(e);
});


const fetchData = async() => {
    try {
        const res = await fetch('api.json');
        const data = await res.json();
        console.log(data);
        pintarCards(data);
    } catch (error) {
        console.log(error)
    }
}

const pintarCards = (data) => {
    data.map(item => {
        $templateCard.content.querySelector('img').src = item.thumbnailUrl;
        $templateCard.content.querySelector('h5').textContent = item.title;
        $templateCard.content.querySelector('p').textContent = item.precio;
        $templateCard.content.querySelector('button').dataset.id = item.id;
        const clone = $templateCard.content.cloneNode(true);
        $fragment.appendChild(clone);
    });
    
    $cards.appendChild($fragment);


}

const addCarrito = (e) => {
    if (e.target.matches('.btn-dark')) {
        // console.log(e.target.parentElement)
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
}

const setCarrito = (obj) => {
    const product = {
        id: obj.querySelector('.btn-dark').dataset.id,
        title: obj.querySelector('h5').textContent,
        price: obj.querySelector('p').textContent,
        cantidad: 1
    }
    
    carrito[product.id] = {...product};
    
    if (carrito.hasOwnProperty(product.id)) {
        product.cantidad = carrito[product.id].cantidad + 1;
    }
    
    pintarCart();

}

const pintarCart = () => {
    $items.innerHTML = '';
    Object.values(carrito).map(prop => {
        $templateCart.content.querySelector('th').textContent = prop.id;
        $templateCart.content.querySelectorAll('td')[0].textContent = prop.title;
        $templateCart.content.querySelectorAll('td')[1].textContent = prop.cantidad;
        $templateCart.content.querySelector('.btn-info').dataset.id = prop.id;
        $templateCart.content.querySelector('.btn-danger').dataset.id = prop.id;
        $templateCart.content.querySelector('span').textContent = (prop.cantidad) * (prop.price);

        const clone = $templateCart.content.cloneNode(true);
        $fragment.appendChild(clone);
    });

    $items.appendChild($fragment);

    pintarFooter();

    localStorage.setItem('carro',JSON.stringify(carrito));
}

const pintarFooter = () => {
    $footer.innerHTML = '';
    
    if (Object.keys(carrito).length === 0) {
        return $footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío, puede comprar.</th>
        `
    }
    
    const cantidadTotal = Object.values(carrito).reduce((ac,{cantidad}) => ac + cantidad, 0);
    const precioTotal = Object.values(carrito).reduce((ac,{cantidad,price}) => ac + (cantidad * price), 0);

    $templateFooter.content.querySelectorAll('td')[0].textContent = cantidadTotal;
    $templateFooter.content.querySelector('span').textContent = precioTotal;


    const clone = $templateFooter.content.cloneNode(true);
    $fragment.appendChild(clone);

    $footer.appendChild($fragment);

    const $deleteCard = document.querySelector('#vaciar-carrito');
    $deleteCard.addEventListener('click',() => {
        // $footer.innerHTML = '';
        carrito = {};
        pintarCart();
    });

}

const btn = (e) => {
    if (e.target.matches('.btn-info')) {
        console.log(carrito[e.target.dataset.id])
        const product = carrito[e.target.dataset.id];
        product.cantidad++;
        carrito[e.target.dataset.id] = {...product};
        pintarCart();
    }

    if (e.target.matches('.btn-danger')) {
        const product = carrito[e.target.dataset.id];
        product.cantidad--;

        if (product.cantidad === 0) {
            delete carrito[e.target.dataset.id]; 
        }
         
        pintarCart();
    }



}
