import Image from 'next/image'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import classnames from 'classnames';
import { ListingDTO } from '@/types/listing';


export const Listings = () => {
    const [listings, setListings] = useState<ListingDTO[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchListings = async () => {
            const response = await axios.get(`/api/listings?page=${page}`);
            setListings(response.data.listings);
            setTotalPages(response.data.totalPages);
        };

        fetchListings();
    }, [page]);

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.map((listing) => (
                    <a href={listing.link} key={listing.id} className="flex">
                        <div className="mb-4 border rounded shadow w-80 flex flex-col">
                            <Image src={listing.imageUrls[0]} alt={listing.title} className="rounded w-full" width={300} height={200} />
                            <div className='p-4 flex-grow'>
                                <h2 className="text-xl font-bold">{listing.title.replace('For sale apartment', '')}</h2>
                                <p className="text-sm text-gray-500">{listing.locality}</p>
                                <p className="text-lg font-semibold">{listing.price.replace('Information about price at agency', 'Private price')}</p>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
            <div className="flex justify-between">
                <button
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                        setPage((prevPage) => prevPage - 1)
                    }}
                    className={classnames('py-2 px-4 rounded bg-gray-500 text-white', { 'opacity-50': page === 1 })}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <div className="py-2 px-4 text-gray-500">
                    Page {page}
                </div>

                <button
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                        setPage((prevPage) => prevPage + 1);
                    }}
                    className={classnames('py-2 px-4 rounded bg-gray-500 text-white', { 'opacity-50': page === totalPages })}
                >
                    Next
                </button>
            </div>
        </div >
    );
};
