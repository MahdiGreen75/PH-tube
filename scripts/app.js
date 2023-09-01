const getArrayDataFromAPI = async (key) => {
    const res = await fetch(key);
    const data = await res.json();
    const arr = data.data;
    return arr;
}

//on page load catagory functionality will happen.
const catagoryButtons = () => {
    const catagorySection = document.getElementById("catagory-section");
    const catagories = getArrayDataFromAPI("https://openapi.programming-hero.com/api/videos/categories");
    catagories.then(res => {
        res.forEach(item => {
            let { category_id: id, category } = item;
            const button = document.createElement("button");
            button.classList = "px-3 py-1 rounded bg-gray-300 border-transparent hover:bg-red-500 hover:text-white";
            button.setAttribute("onclick", `showCards('${id}')`);
            button.innerText = `${category}`;
            catagorySection.appendChild(button);
        })
    })
}
catagoryButtons();

// showing cards on clicking upon catagory buttons
const showCards = (id) => {
    const key = `https://openapi.programming-hero.com/api/videos/category/${id}`;
    const cardsArray = getArrayDataFromAPI(key);
    const cardsParent = document.getElementById("cards-parent");
    cardsArray.then(res => {
        res.forEach(item => {
            let { category_id,
                thumbnail,
                title,
                authors: { profile_picture,
                    profile_name,
                    verified },
                others: { views,
                    posted_date }
            } = item;

            const div = document.createElement("div");
            div.classList = "w-60 mx-auto sm:w-auto sm:m-auto";
            div.innerHTML = `
            <div class="h-40 bg-blue-300 rounded-xl border border-transparent mb-2">
            <img src="${thumbnail}" alt="">
            </div>
            <div class="flex flex-row items-center justify-center gap-2 h-32">
            <div class="flex flex-col justify-start item-center h-full w-[15%]">
                <img src="${profile_picture}" alt="">
            </div>
            <div class="flex flex-col justify-center items-start gap-2 w-[85%]">
                <h1 class="font-semibold text-base leading-tight">${title}</h1>
                <div class="flex flex-row items-center">
                    <span class="text-sm font-normal text-gray-500 mr-1">${profile_name}</span>
                    <span>
                        <img class="w-4" src="${verified ? verified: ""}" alt="">
                    </span>
                </div>
                <div class="text-sm font-normal text-gray-500">
                    <span>${views}</span>views
                </div>
            </div>
            </div>  
            `;
            cardsParent.appendChild(div);
        })
    })
}

// {
//     "category_id": "1001",
//     "thumbnail": "https://i.ibb.co/L1b6xSq/shape.jpg",
//     "title": "Shape of You",
//     "authors": [
//       {
//         "profile_picture": "https://i.ibb.co/D9wWRM6/olivia.jpg",
//         "profile_name": "Olivia Mitchell",
//         "verified": ""
//       }
//     ],
//     "others": {
//       "views": "100K",
//       "posted_date": "16278"
//     }
//   },