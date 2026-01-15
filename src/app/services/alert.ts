import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  
  showSuccess(message: string) {
    this.showAlert(message, 'success');
  }

  showError(message: string) {
    this.showAlert(message, 'danger');
  }

  private showAlert(message: string, type: 'success' | 'danger') {
    const alertHtml = `
      <div class="alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3" 
           style="z-index: 9999; min-width: 300px;" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;

    const alertDiv = document.createElement('div');
    alertDiv.innerHTML = alertHtml;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.parentNode.removeChild(alertDiv);
      }
    }, 5000);
  }
}