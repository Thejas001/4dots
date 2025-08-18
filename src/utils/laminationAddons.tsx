export const getLaminationAddons = () => {
  return [
    {
      Id: 4,
      AddonName: "Lamination Matt",
      Rules: [
        // 12*18 Size Rules
        {
          PaperSize: "12*18 SINGLE SIDE",
          ColorName: "Color",
          PageRange: "0-100",
          Price: "7/page"
        },
        {
          PaperSize: "12*18 SINGLE SIDE",
          ColorName: "Color",
          PageRange: "101-500",
          Price: "7/page"
        },
        {
          PaperSize: "12*18 SINGLE SIDE",
          ColorName: "Color",
          PageRange: "501 and above",
          Price: "6/page"
        },
        {
          PaperSize: "12*18 DOUBLE SIDE",
          ColorName: "Color",
          PageRange: "0-100",
          Price: "7/page"
        },
        {
          PaperSize: "12*18 DOUBLE SIDE",
          ColorName: "Color",
          PageRange: "101-500",
          Price: "7/page"
        },
        {
          PaperSize: "12*18 DOUBLE SIDE",
          ColorName: "Color",
          PageRange: "501 and above",
          Price: "6/page"
        },
        // 13*19 Size Rules
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
        },
      ]
    },
    {
      Id: 5,
      AddonName: "Lamination Glossy",
      Rules: [
        // 13*19 Size Rules
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
        },
      ]
    }
  ];
};

export const getCombinedAddons = (originalAddons: any[] = []): any[] => {
  const laminationAddons = getLaminationAddons();

  const normalize = (name: string) => name.replace(/\s+/g, " ").trim().toLowerCase();

  return [
    ...originalAddons,
    ...laminationAddons.filter(
      lam =>
        !originalAddons.some(
          orig => normalize(orig.AddonName) === normalize(lam.AddonName)
        )
    ),
  ];
};


