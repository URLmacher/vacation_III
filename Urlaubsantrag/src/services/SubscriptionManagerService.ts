export class SubscriptionManager {
  private subscriptions: Array<{ dispose: () => void }> = []

  public subscribeToDomEvent(event: string, callback: () => void): void {
    window.addEventListener(event, callback)

    this.subscriptions.push({
      dispose: () => window.removeEventListener(event, callback)
    })
  }

  public disposeSubscriptions(): void {
    this.subscriptions.forEach((sub) => sub.dispose())
    this.subscriptions.length = 0
  }
}

export class SubscriptionManagerService {
  public createSubscriptionManager(): SubscriptionManager {
    return new SubscriptionManager()
  }
}

export type TEventCallback = (arg0: Event) => void
