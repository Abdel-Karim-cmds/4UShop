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



const uploadForm = document.getElementById('new-product-form');
// const uploadInput = document.querySelectorAll('.upload-input');
const uploadInput = document.getElementById('product_images');
// const uploadInput2 = document.getElementById('product_images2');
const textInputs = document.querySelectorAll('.text-input');
// const colors = document.querySelectorAll('input[type=color]')
// const colorInputs = document.querySelectorAll('input[type="color"]');
// const colorInputs = document.querySelectorAll('.color-input');


// uploadForm.addEventListener('submit', (event) => {
//    event.preventDefault();
//    console.log(textInputs)
//    // console.error(colorInputs)
//    console.log(document.getElementById('color0'))
//    const formData = new FormData();
//    console.log(textInputs)
//    const num = document.getElementById('colorNum').value
//    console.log(num)

//    for (let i = 0; i < num; i++) {
//       const uploadInput = document.getElementById(`product_image${i}`)
//       const files = uploadInput.files;
//       for (let j = 0; j < files.length; j++) {
//          formData.append(`images${i}`, files[j]);
//       }
//    }

//    //Getting the color code
//    for (let i = 0; i < num; i++) {
//       const color = document.getElementById(`color${i}`)
//       const colorValue = color.value
//       // colors.push(colorValue)
//       formData.append("colors", colorValue)
//    }

//    //Getting the color name
//    for (let i = 0; i < num; i++) {
//       const color = document.getElementById(`color_name${i}`)
//       const colorValue = color.value
//       // colors.push(colorValue)
//       formData.append("color_names", colorValue)
//    }


//    textInputs.forEach((input) => {
//       formData.append(input.name, input.value)
//    });


//    console.log(formData)
//    fetch(`/upload-file?table=${table}`, {
//       method: 'POST',
//       body: formData
//    })
//       .then((response) => {
//          if (response.ok) {
//             console.log('Files uploaded successfully.');
//          } else {
//             console.error('Error uploading files.');
//          }
//       })
//       .catch((error) => {
//          console.error('Error uploading files:', error);
//       });
// });

uploadForm.addEventListener('submit', async e => {
    e.preventDefault()
    console.log("Yo")
    const product_group = document.querySelectorAll('.product-group')
    console.log(product_group)

    const product_name = document.getElementById('product_name').value

    const product_price = document.getElementById('product_price').value

    const product_description = document.getElementById('product_description').value

    for (let i = 0; i < product_group.length; i++) {
        const element = product_group[i];
        
        const formData = new FormData()
        // console.log(element.childNodes)
        // console.log(element.childNodes[0].files)
        const images = element.childNodes[0].files
        console.error(images)

        //   images.forEach(image => {
        //     formData.append('image',image)
        //   });

        // Object.entries(images).forEach(
        //     ([key, value]) => {
        //         console.log(value)
        //         formData.append('images', value)
        //     }
        // );

        
        
        
        const uploadInput = document.getElementById(`product_image${i}`)
        // console.error(uploadInput)
        const files = uploadInput.files;
        // console.error(files)
        for (let j = 0; j < files.length; j++) {
            console.error(files[j])
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
        for (let i = 1; i < sizes.length; i = i + 4) {
            const element = sizes[i];
            console.log(element)
            priceObj = {
                ...priceObj,
                [sizes[i].value]: sizes[i + 2].value
            }
        }

        formData.append('price_obj', JSON.stringify(priceObj))

        console.log(priceObj)

        console.log(priceObj)

        const request = await fetch(`/upload-file?table=${table}&product_price=${product_price}&product_name=${product_name}&product_description=${product_description}`, { method: 'POST', body: formData })
        
       const response = await request.json()

       if(request.status === 200)
        createNotification(response.message,'success')
       else
        createNotification(response.message,'error')

        
    }

    // product_group.forEach(async element => {

    //     const formData = new FormData()
    //     // console.log(element.childNodes)
    //     // console.log(element.childNodes[0].files)
    //     const images = element.childNodes[0].files
    //     console.error(images)

    //     //   images.forEach(image => {
    //     //     formData.append('image',image)
    //     //   });

    //     Object.entries(images).forEach(
    //         ([key, value]) => {
    //             console.log(value)
    //             formData.append('images', value)
    //         }
    //     );

    //     // console.log(element.childNodes[1].value)
    //     const color_code = element.childNodes[1].value

    //     formData.append('color_code', color_code)

    //     // console.log(element.childNodes[2].value)
    //     const color_name = element.childNodes[2].value
    //     formData.append('color_name', color_name)
    //     // console.log(element.childNodes[4].childNodes[1].childNodes)
    //     const sizes = element.childNodes[4].childNodes[1].childNodes

    //     let priceObj = {}
    //     for (let i = 1; i < sizes.length; i = i + 4) {
    //         const element = sizes[i];
    //         console.log(element)
    //         priceObj = {
    //             ...priceObj,
    //             [sizes[i].value]: sizes[i + 2].value
    //         }
    //     }

    //     formData.append('price_obj', JSON.stringify(priceObj))

    //     console.log(priceObj)

    //     console.log(priceObj)

    //     const request = await fetch(`/upload-file?table=${table}&product_price=${product_price}&product_name=${product_name}&product_description=${product_description}`, { method: 'POST', body: formData })
    // })


    //    const response = await request.json()

    //    if(request.status === 200)
    //     createNotification(response.message,'success')
    //    else
    //     createNotification(response.message,'error')

})


document.getElementById('colorNum').addEventListener('change', e => {
    const colorNum = e.target.value;
    console.log(colorNum);
    makeUploads(colorNum)
})

function makeSizes(node, size) {
    console.log(node)
    console.log(size)
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

        node.appendChild(sizeNameLabel)
        node.appendChild(br)
        node.appendChild(sizeName)
        node.appendChild(br)
        node.appendChild(sizePriceLabel)
        node.appendChild(sizePrice)
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
            console.log(size);
            // console.log(e.parentNode)
            // console.log(e.parentNode)

            makeSizes(e.target.parentNode.childNodes[1], size)

        })
        // const sizeInput = document.createElement('input')
        // sizeInput.type = 'text'
        // sizeInput.classList = 'size-input'
        // sizeInput.name = `size_name${i}`
        // sizeInput.id = `size_name${i}`
        // sizeInput.placeholder = 'Taille'
        // const sizeInput2 = document.createElement('input')
        // sizeInput2.type = 'text'
        // sizeInput2.classList = 'size-input'
        // sizeInput2.name = `size_price${i}`
        // sizeInput2.id = `size_price${i}`
        // sizeInput2.placeholder = 'Prix'

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