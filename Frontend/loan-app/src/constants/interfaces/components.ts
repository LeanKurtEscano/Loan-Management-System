export interface SortConfig {
    key: string;
    direction: "asc" | "desc";
}

export interface VerificationStatusBadgeProps {
    status: string;
}

export interface SortIconProps {
    column: string;
    sortConfig: SortConfig | null;
}


export interface StatCard {
    title: string;
    value: number;
    icon: any;
    color: string;
}


export const cardVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.4 }
    }),
};

export const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            when: "beforeChildren"
        }
    }
};



export const rowVariants = {
    hidden: { opacity: 0, y: -5 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.2 }
    },
};
