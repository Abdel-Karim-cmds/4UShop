const path = window.location.href.split('/')
const table = path[path.length - 2]
const item = path[path.length - 1]
// console.log(path)



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

async function getItemData(){
    const response = await fetch(`/get-item?item=${item}&table=${table}`)
    const data = await response.json()
    console.log(data)
    createDetails(data)

}

getItemData()

function createDetails(details){
    const container = document.getElementById('container')
    const product_name = document.createElement('h2')
    product_name.innerHTML = details.Name

    const product_price = document.createElement('p')
    product_price.innerHTML = `Prix de base: ${details.Base_price}frs`

    const product_description = document.createElement('p')
    product_description.innerHTML = `Description: ${details.Description}`

    container.appendChild(product_name)
    container.appendChild(product_price)
    container.appendChild(product_description)

    const groups = details.Sizes

    // console.log(sizes)
    console.log(groups)

    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];

        console.error(group)

        //create a container for each group

        const container2 = document.createElement('div')
        container2.classList = 'container'

        //create 2 rows
        // row 1 for pictures

        const row1 = document.createElement('div')
        row1.classList = 'row'

        // the color code

        const colorName = document.createElement('h2')
        colorName.innerHTML = `${group.Color_name} <div class="minbox" style="width:10px; height:10px; background-color:${group.Color}"></div>`
        
        row1.appendChild(colorName)

        //create a box for each image

        const Pictures = group.Pictures


        Pictures.forEach(picture => {
            const box = document.createElement('div')
            box.classList = 'box'
            const img = document.createElement('img')
            img.src = picture

            box.appendChild(img)

            row1.appendChild(box)
        });

        const Prices = group.Price

        const row2 = document.createElement('div')
        row2.classList = 'row'

        Object.entries(Prices).forEach(
            ([key,value]) => {
                const box = document.createElement('div')
                box.classList = 'box'
                const size = document.createElement('h2')
                size.innerHTML = `Taille: ${key}`
                const ul = document.createElement('ul')
                ul.innerHTML = `
                <li>Prix: ${value[0].price}</li>
                <li>Stock: ${value[0].stock}</li>
                `
                box.appendChild(size)
                box.appendChild(ul)
                row2.appendChild(box)
            }
        )

        container2.appendChild(row1)
        container2.appendChild(row2)

        container.appendChild(container2)


    }




    // for (let i = 0; i < sizes.length; i++) {
    //     const element = sizes[i];
    //     console.log(element)
    //     const container2 =document.createElement('div')
    //     container2.classList = 'container'

    //     const row = document.createElement('div')
    //     row.classList = 'row'

    //     const colorName = document.createElement('h2')
    //     colorName.innerHTML = `Couleur: ${element.Color_name} <div class="minbox" style="width:10px; height:10px; background-color:${element.Color}></div>`

    //     row.appendChild(colorName)
    //     const pictures = element.Pictures

    //     pictures.forEach(picture => {
    //         const box = document.createElement('div')
    //         box.classList = 'box'

    //         const img = document.createElement('img')
    //         img.src = picture

    //         box.appendChild(img)

    //         row.appendChild(box)
    //     });

    //     container2.appendChild(row)



    //     container.appendChild(container2)
    // }

}