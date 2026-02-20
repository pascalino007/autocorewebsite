// react
import React from 'react';
// application
import BlockGaragePartners from './BlockGaragePartners';
import BlockAccessories from './BlockAccessories';
import BlockMechanicalTools from './BlockMechanicalTools';

interface BlockHomeSectionsProps {
    showGaragePartners?: boolean;
    showAccessories?: boolean;
    showMechanicalTools?: boolean;
    accessoriesCategorySlug?: string;
    toolsCategorySlug?: string;
}

function BlockHomeSections({ 
    showGaragePartners = true,
    showAccessories = true,
    showMechanicalTools = true,
    accessoriesCategorySlug = "accessoires",
    toolsCategorySlug = "outils-mecanique"
}: BlockHomeSectionsProps) {
    return (
        <div className="block-home-sections">
            {/* Garage Partners Section */}
            {showGaragePartners && (
                <section className="block-home-sections__garage-partners">
                    <BlockGaragePartners />
                </section>
            )}

            {/* Accessories Section */}
            {showAccessories && (
                <section className="block-home-sections__accessories">
                    <BlockAccessories categorySlug={accessoriesCategorySlug} />
                </section>
            )}

            {/* Mechanical Tools Section */}
            {showMechanicalTools && (
                <section className="block-home-sections__mechanical-tools">
                    <BlockMechanicalTools categorySlug={toolsCategorySlug} />
                </section>
            )}
        </div>
    );
}

export default React.memo(BlockHomeSections);
