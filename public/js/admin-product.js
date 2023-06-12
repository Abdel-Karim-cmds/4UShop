const path = window.location.href.split('/')
const table = path[path.length - 1]
console.log(path)



$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
});
$("#menu-toggle-2").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled-2");
    $('#menu ul').hide();
});

function initMenu() {
    $('#menu ul').hide();
    $('#menu ul').children('.current').parent().show();
    //$('#menu ul:first').show();
    $('#menu li a').click(
        function () {
            var checkElement = $(this).next();
            if ((checkElement.is('ul')) && (checkElement.is(':visible'))) {
                return false;
            }
            if ((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
                $('#menu ul:visible').slideUp('normal');
                checkElement.slideDown('normal');
                return false;
            }
        }
    );
}
$(document).ready(function () {
    initMenu();
});


// Section for Vetements page
const uploadForm = document.getElementById('new-product-form');
uploadForm.addEventListener('submit', async e => {
    e.preventDefault()
    console.log("Yo")
    const product_group = document.querySelectorAll('.product-group')
    console.log(product_group)

    const product_name = document.getElementById('product_name').value

    const product_price = document.getElementById('product_price').value

    const product_description = document.getElementById('product_description').value

    const progressBar = document.getElementsByClassName('progress-bar')[0]

    for (let i = 0; i < product_group.length; i++) {
        const element = product_group[i];

        const formData = new FormData()
        // const images = element.childNodes[0].files

        const uploadInput = document.getElementById(`product_image${i}`)
        const files = uploadInput.files;
        for (let j = 0; j < files.length; j++) {
            // console.error(files[j])
            formData.append('images', files[j]);
        }

        // console.log(element.childNodes[1].value)
        const color_code = element.childNodes[1].value

        formData.append('color_code', color_code)

        // console.log(element.childNodes[2].value)
        const color_name = element.childNodes[2].value
        formData.append('color_name', color_name)
        // console.log(element.childNodes[4].childNodes[1].childNodes)
        const sizes = element.childNodes[4].childNodes[1].childNodes

        let priceObj = {}
        for (let i = 1; i < sizes.length; i = i + 6) {
            const element = sizes[i];
            console.log(element)
            priceObj = {
                ...priceObj,
                // [sizes[i].value]: sizes[i + 2].value,
                // Stock: sizes[i+4].value
                [sizes[i].value]: [
                    {
                        price: sizes[i+2].value,
                        stock: sizes[i+4].value
                    }
                ]
            }
        }
        
        console.error(sizes)
        console.log("***********************")
        console.error(priceObj)
        console.log("***********************")

        formData.append('price_obj', JSON.stringify(priceObj))

        // const request = await fetch(`/upload-file?table=${table}&product_price=${product_price}&product_name=${product_name}&product_description=${product_description}`, { method: 'POST', body: formData })
        progressBar.style.display = 'block'
        const request = await fetch(`/upload-file?product_price=${product_price}&product_name=${product_name}&product_description=${product_description}&table=${table}`, { method: 'POST', body: formData })
        .catch(err =>{
            createNotification('oops... Something went wrong','error')
        })
        const response = await request.json()
        

        if (request.status === 200) {
            createNotification(response.message, 'success')


            const width = ((i + 1) / product_group.length) * 100
            progressBar.style.setProperty('--width', width)
            if(width === 100){
                progressBar.style.display = 'none'
                getData()
            }
        }
        else {
            createNotification(response.message, 'error')
            break
        }

    }
})


document.getElementById('colorNum').addEventListener('change', e => {
    const colorNum = e.target.value;
    console.log(colorNum);
    makeUploads(colorNum)
})

function makeSizes(node, size) {
    // console.log(node)
    // console.log(size)
    node.innerHTML = ''
    const br = document.createElement('br')
    const div = document.createElement('div')
    div.innerHTML = ''
    div.classList = 'sizes'
    for (let i = 0; i < size; i++) {

        const sizeNameLabel = document.createElement('label')
        sizeNameLabel.innerText = 'Taille'

        const sizeName = document.createElement('input')
        sizeName.type = 'text'
        sizeName.name = `size${i}`
        sizeName.id = `size${i}`
        sizeName.placeholder = "Taille"


        const sizePriceLabel = document.createElement('label')
        sizePriceLabel.innerText = 'Prix'

        const sizePrice = document.createElement('input')
        sizePrice.type = 'number'
        sizePrice.name = `sizePrice${i}`
        sizePrice.id = `sizePrice${i}`
        sizePrice.placeholder = "Prix"

        
        const stockLabel = document.createElement('label')
        stockLabel.innerText = 'Nombre en stock'


        const stock = document.createElement('input')
        stock.type = 'number'
        stock.name = `stock${i}`
        stock.id = `stock${i}`
        stock.placeholder = 'Nombre en stock'

        node.appendChild(sizeNameLabel)
        node.appendChild(br)
        node.appendChild(sizeName)
        node.appendChild(br)
        node.appendChild(sizePriceLabel)
        node.appendChild(br)
        node.appendChild(sizePrice)
        node.appendChild(br)
        node.appendChild(stockLabel)
        node.appendChild(br)
        node.appendChild(stock)
        node.appendChild(br)
    }

    // node.appendChild(div)
    // node.appendChild(br)
}

function makeUploads(number) {
    const colorChoice = document.getElementById('color-choice')
    colorChoice.innerHTML = ''
    for (let i = 0; i < number; i++) {
        const div = document.createElement('div')
        div.classList = 'product-group'

        const input = document.createElement('input')
        input.type = 'file'
        input.classList = 'upload-input'
        input.name = `product_image${i}`
        input.id = `product_image${i}`
        input.multiple = true
        input.accept = 'image/*'

        const colorInput = document.createElement('input')
        colorInput.type = 'color'
        colorInput.classList = 'color-input'
        colorInput.name = `color${i}`
        colorInput.id = `color${i}`

        const colorName = document.createElement('input')
        colorName.type = 'text'
        colorName.classList = 'color-name'
        colorName.name = `color_name${i}`
        colorName.id = `color_name${i}`

        const sizeLabel = document.createElement('label')
        sizeLabel.innerText = 'Nombre de taille'

        const sizeChoice = document.createElement('select')
        sizeChoice.classList = 'size-choice'
        sizeChoice.name = `size${i}`
        sizeChoice.id = `size${i}`
        sizeChoice.innerHTML = `<option value="" selected>-- Choisir --</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
        `
        const divSizes = document.createElement('div')
        divSizes.classList = 'select-size'

        const subSize = document.createElement('div')
        subSize.id = `subSize${i}`
        subSize.name = `subSize${i}`


        sizeChoice.addEventListener('change', e => {
            const size = e.target.value
            // console.log(size);

            makeSizes(e.target.parentNode.childNodes[1], size)

        })

        

        const br = document.createElement('br')

        divSizes.appendChild(sizeChoice)
        divSizes.appendChild(subSize)

        div.appendChild(input)
        div.appendChild(colorInput)
        div.appendChild(colorName)
        div.appendChild(sizeLabel)
        div.appendChild(divSizes)
        colorChoice.appendChild(div)
        colorChoice.appendChild(br)
        colorChoice.appendChild(br)
        colorChoice.appendChild(br)

    }
}

//End of Vetements page

// Notifications

const toasts = document.querySelector('#toasts');

const createNotification = (message, type) => {
    console.log(message, type);
    const toast = document.createElement('div');
    toast.classList.add('toast');
    toast.innerText = message;
    toast.classList.add(type);
    toasts.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
};

async function getData(){
    const response = await fetch(`/get-products?table=${table}`)
    const data = await response.json()
    console.log(data)
    populateData(data)
}

getData()

function populateData(products){
    const productInformation  = document.getElementById('product-information')
    productInformation.innerHTML = ''
    document.getElementById('Nothingess').style.display = 'none'
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        console.log(product)
        let div = document.createElement('div')
        div.classList = 'col-lg-4'

        let img = document.createElement('img')
        let image = product.Sizes[0].Pictures[0]
        img.src = image
        img.classList = 'img-logo'
        div.appendChild(img)
        console.error(image)

        let h2 = document.createElement('h2')
        let product_name = document.createTextNode(product.Name)
        h2.appendChild(product_name)
        div.appendChild(h2)


        let p = document.createElement('p')
        let product_description = document.createTextNode(product.Description)
        p.appendChild(product_description)
        div.appendChild(p)

        let p2 = document.createElement('p')
        let Base_price = document.createTextNode(`Prix de base: ${product.Base_price}frs`)
        p2.appendChild(Base_price)
        div.appendChild(p2)

        let p3 = document.createElement('p')
        let a = document.createElement('a')
        a.href = `${table}/${product.Name}`
        a.classList = 'btn'
        a.innerHTML = 'Voire plus &raquo;'
        p3.appendChild(a)
        div.appendChild(p3)



        productInformation.appendChild(div)

    }
}