// react
import React, { useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';
// application
import getShopPageData from '~/store/shop/shopHelpers';
import ShopPageShop from '~/components/shop/ShopPageShop';
import { wrapper } from '~/store/store';
import { shopApi } from '~/api';
import { IProduct } from '~/interfaces/product';
import { sanitizeForSerialization, sanitizeShop, sanitizeCategory } from '~/utils/serialization';

interface SearchPageProps {
    initialState: any;
    searchQuery: string;
    initialResults?: {
        products: IProduct[];
        total: number;
        page: number;
        totalPages: number;
    };
}

export const getServerSideProps: GetServerSideProps<SearchPageProps> = wrapper.getServerSideProps((store) => async (context): Promise<GetServerSidePropsResult<SearchPageProps>> => {
    const { query: searchQuery } = context.query as { query: string };
    
    if (!searchQuery) {
        // No search query provided, show 404
        return {
            notFound: true,
        };
    }
    
    const decodedQuery = decodeURIComponent(searchQuery);
    
    // Initialize shop data
    await getShopPageData(store, context);
    
    // Fetch search results
    let initialResults = null;
    try {
        initialResults = await shopApi.getSearchResults(decodedQuery, {
            page: 1,
            limit: 20,
        });
        // Sanitize results for serialization
        initialResults = sanitizeForSerialization(initialResults);
        
        // If no results found, redirect to 404 page
        if (!initialResults.products || initialResults.products.length === 0) {
            return {
                notFound: true,
            };
        }
    } catch (error) {
        console.error('Failed to fetch search results:', error);
        // If search fails, also show 404
        return {
            notFound: true,
        };
    }
    
    // Get state and sanitize it before modifying
    const state = store.getState();
    let cleanState = sanitizeForSerialization(state);
    
    // Additional sanitization for products list: shop (latitude/longitude) and categories must be JSON-serializable
    if (cleanState.shop && cleanState.shop.productsList && cleanState.shop.productsList.items) {
        cleanState.shop.productsList.items = cleanState.shop.productsList.items.map((item: any) => ({
            ...item,
            shop: sanitizeShop(item.shop),
            categories: item.categories ? item.categories.map((cat: any) => sanitizeCategory(cat)) : [],
        }));
    }
    
    // Set search query in the sanitized state
    if (cleanState.shop && cleanState.shop.currentFilters) {
        cleanState.shop.currentFilters = {
            ...cleanState.shop.currentFilters,
            search: decodedQuery,
        };
    }

    return { 
        props: { 
            initialState: cleanState,
            searchQuery: decodedQuery,
            initialResults,
        } 
    };
});

function SearchPage({ searchQuery, initialResults }: SearchPageProps) {
    const intl = useIntl();
    const router = useRouter();
    const [searchResults, setSearchResults] = useState(initialResults);
    const [loading, setLoading] = useState(false);

    const performSearch = async (query: string, page: number = 1) => {
        setLoading(true);
        try {
            const results = await shopApi.getSearchResults(query, {
                page,
                limit: 20,
            });
            
            // If no results found, redirect to 404
            if (!results.products || results.products.length === 0) {
                router.push('/404');
                return;
            }
            
            setSearchResults(results);
        } catch (error) {
            console.error('Search failed:', error);
            // If search fails, redirect to 404
            router.push('/404');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-results-page">
            <div className="container">
                <div className="search-results-header">
                    <h1 className="search-results-title">
                        <FormattedMessage 
                            id="TEXT_SEARCH_RESULTS_TITLE"
                            values={{ query: searchQuery }}
                        />
                    </h1>
                    <p className="search-results-subtitle">
                        {loading ? (
                            <FormattedMessage id="TEXT_SEARCHING" />
                        ) : searchResults ? (
                            <FormattedMessage 
                                id="TEXT_SEARCH_RESULTS_COUNT"
                                values={{ count: searchResults.total }}
                            />
                        ) : (
                            <FormattedMessage id="TEXT_SEARCH_RESULTS_SUBTITLE" />
                        )}
                    </p>
                </div>
            </div>
            
            <ShopPageShop
                layout="grid"
                gridLayout="grid-4-sidebar"
                sidebarPosition="start"
            />
        </div>
    );
}

export default SearchPage;
