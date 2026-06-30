import { PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function getFinancialContextSummary(userId: number): Promise<string> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Fetch current month transactions matching your exact schema layout
  const transactions = await prisma.transaction.findMany({
    where: {
      // userId: userId, // <-- Ensure this column exists in your transactions table for security!
      transactionDate: {
        gte: startOfMonth,
      },
    },
    include: {
      category: true,    // Joins parent category info (e.g., "Expenses")
      subcategory: true, // Joins subcategory info (e.g., "Rental", "Part Time")
    },
    orderBy: {
      transactionDate: 'desc',
    },
  });

  let totalIncome = 0;
  let totalExpenses = 0;
  const subcategoryBreakdown: Record<string, number> = {};

  // Compute financial state summaries based on joined metadata records
  transactions.forEach((tx) => {
    // Safely cast Prisma Decimal down to a standard JavaScript calculation number
    const amount = Number(tx.amount);
    
    const parentCategoryName = tx.category?.name?.toLowerCase() || '';
    const subcategoryName = tx.subcategory?.name || 'Uncategorized';

    // Route cash flows based on your category naming trees
    if (parentCategoryName.includes('income') || subcategoryName.toLowerCase() === 'part time') {
      totalIncome += amount;
    } else {
      totalExpenses += amount;
      // Aggregate expenses by their specific subcategory label
      subcategoryBreakdown[subcategoryName] = (subcategoryBreakdown[subcategoryName] || 0) + amount;
    }
  });

  const netSavings = totalIncome - totalExpenses;

  // Compile a structured string matrix optimized for the Groq inference engine
  return `
=== LIVE LEDGER ACCOUNTING CONTEXT ===
Current Period: ${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}
Total Registered Income: RM ${totalIncome.toFixed(2)}
Total Registered Expenses: RM ${totalExpenses.toFixed(2)}
Net Balance Delta: RM ${netSavings.toFixed(2)}

Itemized Subcategory Outlays:
${Object.entries(subcategoryBreakdown)
  .map(([name, amt]) => `- ${name}: RM ${amt.toFixed(2)}`)
  .join('\n')}

Recent Activity Log:
${transactions
  .slice(0, 5)
  .map(tx => `* [${tx.transactionDate.toISOString().split('T')[0]}] ${tx.subcategory?.name || tx.category.name}: RM ${Number(tx.amount).toFixed(2)} (${tx.description || 'No description'})`)
  .join('\n')}
======================================
  `.trim();
}