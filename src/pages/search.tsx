// react
import React, { useEffect, useState } from 'react';
import { GetServerSideProps, GetServerSidePropsResult, GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';
import { Store } from 'redux';
// application
import getShopPageData from '~/store/shop/shopHelpers';
import ShopPageShop from '~/components/shop/ShopPageShop';
import { wrapper } from '~/store/store';
import { shopApi } from '~/api';
import { IProduct } from '~/interfaces/product';
import { sanitizeForSerialization } from '~/utils/serialization';
import { IRootState } from '~/store/root/rootTypes';

interface SearchPageProps {
    initialState: any;
    searchQuery: string;
}

export const getServerSideProps: GetServerSideProps<SearchPageProps> = wrapper.getServerSideProps((store: Store<IRootState>) => async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<SearchPageProps>> => {
    const { query: searchQuery } = context.query as { query: string };
    
    if (!searchQuery) {
        // No search query provided, show 404
        return {
            notFound: true,
        };
    }
    
    const decodedQuery = decodeURIComponent(searchQuery);
    
    // Initialize shop layout data (categories, filters, etc.)
    await getShopPageData(store, context);

    // Get state and sanitize it for JSON serialization
    const state = store.getState();
    const cleanState = sanitizeForSerialization(state);

    return {
        props: {
            initialState: cleanState,
            searchQuery: decodedQuery,
        },
    };
});

function SearchPage({ searchQuery }: SearchPageProps) {
    const intl = useIntl();
    const router = useRouter();
    const [searchResults, setSearchResults] = useState<{
        products: IProduct[];
        total: number;
        page: number;
        totalPages: number;
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const performSearch = async (query: string, page: number = 1) => {
        setLoading(true);
        try {
            const results = await shopApi.getSearchResults(query, {
                page,
                limit: 20,
            });
            
            // Always set search results, even if empty
            setSearchResults(results || { products: [], total: 0, page: 1, totalPages: 0 });
        } catch (error) {
            console.error('Search failed:', error);
            // If search fails, show empty results instead of redirecting
            setSearchResults({ products: [], total: 0, page: 1, totalPages: 0 });
        } finally {
            setLoading(false);
        }
    };

    // Perform initial search on mount / when query changes (client-side, using fetch/axios-equivalent)
    useEffect(() => {
        if (!searchQuery) return;
        performSearch(searchQuery, 1);
    }, [searchQuery]);

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
                        {searchResults && searchResults.products.length === 0 && !loading && (
                            <span className="text-muted ml-2">
                                <FormattedMessage id="TEXT_NO_RESULTS_FOUND" />
                            </span>
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
