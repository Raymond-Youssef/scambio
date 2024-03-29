import React, {useEffect, useRef, useState} from 'react'
import Authenticated from "@/Layouts/Authenticated";
import {useForm} from "@inertiajs/inertia-react";
import Input from '@/Components/Input';
import ValidationErrors from "@/Components/ValidationErrors";
import Button from "@/Components/Button";

export default function Edit({auth, product, categories}) {

    const { data, setData, post, processing, errors } = useForm({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        status: product.status,
        images: [],
        _method: 'PATCH'
    });

    const [selectedImages, setSelectedImages] = useState(product.images);

    const handleImageChange = (ev) => {
        setData(ev.target.name, ev.target.files);
        if(ev.target.files) {
            const fileArr = Array.from(ev.target.files).map( file => URL.createObjectURL(file) )
            setSelectedImages([])
            setSelectedImages((prevImage) => prevImage.concat(fileArr))
            Array.from(ev.target.files).map(
                (file) => Url.revokeObjectURL(file)
            )
        }
    }

    const renderPhotos = (source) => {
        return source.map((image, index) =>
            <div key={index} className={`carousel-item rounded ${index === 0 && "active"}`}>
                <img src={image} className="d-block w-100 rounded" alt="..." />
            </div>
        )
    }



    const handleChange = (event) => {
        setData(event.target.name, event.target.type === 'checkbox' ? event.target.checked : event.target.value);
    };

    const submit =  async (e) => {
        e.preventDefault();
        await post(route('products.update', product.id));
    };

    return(
        <Authenticated
            auth={auth}
        >
            <div className={'container row justify-content-between align-items-center'}>
                <div className={'d-flex justify-content-around align-items-center col-md-6'}>
                    <div className={'right bg-light shadow-lg p-3 mb-5 bg-body rounded position-relative'} style={{maxWidth: "50%"}}>


                        <ValidationErrors errors={errors} />

                        <form onSubmit={submit} encType={'multipart'}>
                            <h4 className={'mb-5 text-muted'}>Editing <small className={'text-dark'}>{product.name}</small></h4>
                            <div className="row mb-3">
                                <label htmlFor="input-name" className="col-sm-2 col-form-label">Name</label>
                                <div className="col-sm-10">
                                    <Input
                                        type="text"
                                        name={'name'}
                                        value={data.name}
                                        isFocused={true}
                                        handleChange={handleChange}
                                        className="form-control"
                                        id="input-name" required />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label htmlFor="input-price" className="col-sm-2 col-form-label">Price</label>
                                <div className="col-sm-10">
                                    <Input
                                        type="number"
                                        min={'1'}
                                        name={'price'}
                                        value={data.price}
                                        handleChange={handleChange}
                                        className="form-control"
                                        id="input-price" required/>
                                </div>
                            </div>
                            <fieldset className="row mb-3">
                                <legend className="col-form-label col-sm-3 pt-0">Category</legend>
                                <div className="col-sm-9">
                                    {
                                        categories.map( (category, index) => (
                                            <div className="form-check" key={index}>
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="category_id"
                                                    id={`category-${category.id}`}
                                                    value={category.id}
                                                    onChange={handleChange}
                                                    checked={data.category_id == category.id}
                                                />
                                                <label className="form-check-label" htmlFor={`category-${category.id}`}>
                                                    {category.name}
                                                </label>
                                            </div>
                                        ))
                                    }
                                </div>
                            </fieldset>
                            <div className="mb-3">
                                <label htmlFor="description-input" className="form-label">Description</label>
                                <textarea
                                    onChange={handleChange}
                                    name={'description'}
                                    className="form-control"
                                    id="description-input" rows="3"
                                    value={data.description}
                                    required/>
                            </div>
                            <fieldset className="row mb-3">
                                <legend className="col-form-label col-sm-2 pt-0">Status</legend>
                                <div className="col-sm-10">
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="status" id="status-new"
                                               value="new"
                                               checked={data.status === 'new'}
                                               onChange={handleChange}/>
                                        <label className="form-check-label" htmlFor="status-new">
                                            New
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="status" id="status-used"
                                               value="used"
                                               checked={data.status === 'used'}
                                               onChange={handleChange}
                                        />
                                        <label className="form-check-label" htmlFor="status-used">
                                            Used
                                        </label>
                                    </div>

                                    <label htmlFor={'file-upload'} className={'btn btn-info text-white'}>Upload Images</label>
                                    <input
                                        multiple={true}
                                        id={'file-upload'}
                                        type={'file'}
                                        style={{display: "none"}}
                                        accept={'image/*'}
                                        name={'images'}
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </fieldset>
                            <Button className="btn btn-primary" processing={processing}>
                                Edit belonging
                            </Button>
                        </form>
                    </div>
                </div>

                <div className={'d-flex justify-content-around col-md-5'}>
                    <div id="carouselExampleControls" className="carousel slide mb-5" data-bs-ride="carousel" style={{width: "500px"}}>
                        <div className="carousel-inner">
                            { selectedImages.length === 0 ?
                                <div className={`carousel-item rounded shadow-lg p-5 bg-white active`}>
                                    <h1 className={'display-6 text-muted h-100'}>No images uploaded yet</h1>
                                </div>
                                :renderPhotos(selectedImages)}
                        </div>
                        <button className="carousel-control-prev" type="button"
                                data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"/>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button"
                                data-bs-target="#carouselExampleControls" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"/>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
            </div>
        </Authenticated>
    );
}
