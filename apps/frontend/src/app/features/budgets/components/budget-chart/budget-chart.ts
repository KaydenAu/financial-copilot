import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { CommonModule } from '@angular/common';
import { Budget } from '../../budget.model';

@Component({
    selector: 'app-budget-chart',
    standalone: true,
    imports: [CommonModule],
    template: `<article class="chart-card"><canvas #canvas></canvas></article>`,
    styleUrl: './budget-chart.scss',
})
export class BudgetChart implements AfterViewInit, OnChanges, OnDestroy {
    @Input() budgets: Budget[] = [];
    @ViewChild('canvas') canvas?: ElementRef<HTMLCanvasElement>;

    private chart: Chart | null = null;

    ngAfterViewInit(): void {
        this.render();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['budgets']) {
            this.render();
        }
    }

    ngOnDestroy(): void {
        this.chart?.destroy();
    }

    private render(): void {
        const ctx = this.canvas?.nativeElement.getContext('2d');
        if (!ctx) return;

        this.chart?.destroy();
        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.budgets.map((budget) => budget.category),
                datasets: [
                    { label: 'Limit', data: this.budgets.map((budget) => budget.limit), backgroundColor: '#2563eb' },
                    { label: 'Spent', data: this.budgets.map((budget) => budget.spent), backgroundColor: '#f97316' },
                ],
            },
            options: { responsive: true, maintainAspectRatio: false },
        });
    }
}
