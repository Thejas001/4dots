export const getLaminationAddons = () => {
  return [
    {
      Id: 4,
      AddonName: "Lamination Matt",
      Rules: [
        {
          PaperSize: "13*19 SINGLE SIDE",
          ColorName: "Color",
          PageRange: "101-500",
          Price: "7/page"
        },
        {
          PaperSize: "13*19 SINGLE SIDE",
          ColorName: "Color",
          PageRange: "501 and above",
          Price: "6/page"
        },
        {
          PaperSize: "13*19 DOUBLE SIDE",
          ColorName: "Color",
          PageRange: "101-500",
          Price: "7/page"
        },
        {
          PaperSize: "13*19 DOUBLE SIDE",
          ColorName: "Color",
          PageRange: "501 and above",
          Price: "6/page"
        }
      ]
    },
    {
      Id: 5,
      AddonName: "Lamination Glossy",
      Rules: [
        {
          PaperSize: "13*19 SINGLE SIDE",
          ColorName: "Color",
          PageRange: "101-500",
          Price: "7/page"
        },
        {
          PaperSize: "13*19 SINGLE SIDE",
          ColorName: "Color",
          PageRange: "501 and above",
          Price: "6/page"
        },
        {
          PaperSize: "13*19 DOUBLE SIDE",
          ColorName: "Color",
          PageRange: "101-500",
          Price: "7/page"
        },
        {
          PaperSize: "13*19 DOUBLE SIDE",
          ColorName: "Color",
          PageRange: "501 and above",
          Price: "6/page"
        }
      ]
    }
  ];
};

export const getCombinedAddons = (originalAddons: any[] = []): any[] => {
  return [...originalAddons, ...getLaminationAddons()];
}; 